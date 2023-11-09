# frozen_string_literal: true

class Webhook < ApplicationRecord
  audited
  include Authorizable
  include Encryptable

  extend FriendlyId
  friendly_id :name
  include Parameterizable::ByIdName

  graphql_type 'ForemanWebhooks::Types::Webhook'

  EVENT_POSTFIX = ".#{Foreman::Observable::DEFAULT_NAMESPACE}"

  DEFAULT_PAYLOAD_TEMPLATE = 'Webhook Template - Payload Default'

  ALLOWED_HTTP_METHODS = %w[POST GET PUT DELETE PATCH].freeze

  encrypts :password

  attribute :events, :string, array: true, default: []

  validates_lengths_from_database
  validates :name, :target_url, :events, presence: true
  validates :target_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]),
                                   message: _('URL must be valid and schema must be one of: %s') % 'http, https' }
  validates :http_method, inclusion: { in: ALLOWED_HTTP_METHODS }

  belongs_to :webhook_template, foreign_key: :webhook_template_id

  before_save :set_default_template, unless: :webhook_template

  scope :for_event, ->(events) { where('events @> ARRAY[?]::varchar[]', Array(events)) }

  default_scope -> { order('webhooks.name') }

  scoped_search on: :name, complete_value: true, default_order: true
  scoped_search on: :target_url, complete_value: :true
  scoped_search on: :enabled, complete_value: { true: true, false: false }

  def self.available_events
    ::Foreman::EventSubscribers.all_observable_events
  end

  def self.deliver(event_name:, payload:)
    for_event(event_name).includes([:webhook_template]).each do |target|
      target.deliver(event_name: event_name, payload: payload) if target.enabled?
    end
  end

  def events=(events)
    events = Array(events).map do |event|
      next event if event.end_with?(EVENT_POSTFIX)

      event.to_s.underscore + EVENT_POSTFIX
    end
    super(self.class.available_events & events)
  end

  def event=(event)
    self.events = event
  end

  def event
    events.first
  end

  def deliver(event_name:, payload:)
    payload_to_deliver = rendered_payload(event_name, payload)
    headers_to_deliver = rendered_headers(event_name, payload)
    url_to_deliver = rendered_targed_url(event_name, payload)
    ::ForemanWebhooks::DeliverWebhookJob.perform_later(
      event_name: event_name,
      payload: payload_to_deliver,
      headers: headers_to_deliver,
      url: url_to_deliver,
      webhook_id: id
    )
  end

  def test(payload: nil)
    ForemanWebhooks::WebhookService.new(
      webhook: self,
      headers: http_headers,
      url: target_url,
      event_name: event,
      payload: test_payload(payload || '')
    ).execute
  end

  def ca_certs_store
    store = OpenSSL::X509::Store.new
    if ssl_ca_certs.blank?
      store.set_default_paths
      return store
    end

    ssl_ca_certs.split(/(?=-----BEGIN)/).each do |cert|
      store.add_cert(OpenSSL::X509::Certificate.new(cert))
    end
    store
  rescue StandardError => e
    raise _(format('Failed to build X509 certificate store for HTTPS client, error: %s', e.message))
  end

  private

  def set_default_template
    self.webhook_template = WebhookTemplate.find_by!(name: DEFAULT_PAYLOAD_TEMPLATE)
  end

  def variables(event_name, payload)
    {
      event_name: event_name,
      object: payload[:object],
      context: payload[:context],
      payload: payload,
      webhook_id: id
    }
  end

  def render_source(source, event_name, payload)
    scope = Foreman::Renderer.get_scope(
      klass: ForemanWebhooks::Renderer::Scope::WebhookTemplate,
      variables: variables(event_name, payload),
      source: source
    )
    Foreman::Renderer.render(source, scope)
  end

  def rendered_payload(event_name, payload)
    webhook_template.render(variables: variables(event_name, payload))
  end

  def rendered_headers(event_name, payload)
    return nil if http_headers.empty?

    source = Foreman::Renderer::Source::String.new(name: 'HTTP header template', content: http_headers)
    render_source(source, event_name, payload)
  end

  def rendered_targed_url(event_name, payload)
    source = Foreman::Renderer::Source::String.new(name: 'HTTP target URL template', content: target_url)
    render_source(source, event_name, payload)
  end

  def test_payload(payload)
    return payload if payload.is_a?(String)

    payload.to_json
  end
end
