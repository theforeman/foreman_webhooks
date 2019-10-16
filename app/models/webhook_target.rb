# frozen_string_literal: true

class WebhookTarget < ApplicationRecord
  include Authorizable

  attribute :events, :string, array: true, default: []

  validates_lengths_from_database
  validates :name, :target_url, :events, presence: true
  validates :target_url, format: URI.regexp(%w[http https])

  scope :for_event, ->(events) { where('events @> ARRAY[?]::varchar[]', Array(events)) }

  def self.available_events
    %w[subnet_created subnet_changed subnet_deleted]
  end

  def self.deliver(event_name:, payload:)
    for_event(event_name).each do |target|
      target.deliver(event_name: event_name, payload: payload)
    end
  end

  def events=(events)
    events = Array(events).map { |event| event.to_s.underscore }
    super(self.class.available_events & events)
  end

  def deliver(event_name:, payload:)
    ::ForemanWebhooks::DeliverWebhookJob.new(event_name: event_name, payload: payload, webhook_target_id: id).perform_later
  end
end
