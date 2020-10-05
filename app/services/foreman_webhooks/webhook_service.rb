# frozen_string_literal: true

module ForemanWebhooks
  class WebhookService
    attr_accessor :webhook, :event_name, :payload

    delegate :logger, to: Rails

    def initialize(webhook:, event_name:, payload:)
      @webhook = webhook
      @event_name = event_name
      @payload = payload
    end

    def execute
      response = request(webhook, payload)

      status = case response.code.to_i
               when 400..599
                 :error
               else
                 :success
               end

      {
        status: status,
        message: response.message,
        http_status: response.code.to_i
      }
    rescue SocketError, OpenSSL::SSL::SSLError, Errno::ECONNREFUSED, Errno::ECONNRESET, Errno::EHOSTUNREACH, Net::OpenTimeout, Net::ReadTimeout => e
      Foreman::Logging.exception("Failed to execute the webhook #{webhook.name} -> #{event_name}", e)
      {
        status: :error,
        message: e.to_s
      }
    end

    private

    def request(webhook, payload)
      uri = URI.parse(webhook.target_url)

      http_method = Object.const_get("Net::HTTP::#{webhook.http_method.capitalize}")

      request = http_method.new(uri.request_uri)
      request.basic_auth(webhook.user, webhook.password) if webhook.user && webhook.password
      request['Content-Type'] = webhook.http_content_type
      request.body = payload

      logger.debug("#{webhook.http_method.to_s.upcase} request for webhook #{webhook.name}:")
      logger.debug("Target: #{uri}")
      logger.debug("Headers: #{request.to_hash.inspect}")
      logger.debug("Body: #{request.body.inspect}")

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.scheme == 'https')
      http.verify_mode = webhook.verify_ssl? ? OpenSSL::SSL::VERIFY_PEER : OpenSSL::SSL::VERIFY_NONE

      return http.request(request) if webhook.ssl_ca_file.blank?

      Tempfile.create('foreman-webhooks-ca-') do |ca_file|
        ca_file.write(OpenSSL::X509::Certificate.new(webhook.ssl_ca_file))
        http.ca_file = ca_file.path
        http.request(request)
      end
    end
  end
end
