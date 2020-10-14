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
      Foreman::Logging.blob("Webhook payload for event #{event_name}", payload)
      response = request(webhook, payload)

      status = case response.code.to_i
               when 400..599
                 logger.error("#{webhook.http_method.to_s.upcase} response was #{response.code}")
                 :error
               else
                 logger.info("#{webhook.http_method.to_s.upcase} response was #{response.code}")
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

      logger.info("#{webhook.http_method.to_s.upcase} request for webhook #{webhook.name}:")
      logger.debug("Target: #{uri}")
      logger.debug("Headers: #{request.to_hash.inspect}")
      logger.debug("Body: #{request.body.inspect}")

      http = Net::HTTP.new(uri.host, uri.port)
      if uri.scheme == 'https'
        http.use_ssl = true
        http.verify_mode = webhook.verify_ssl? ? OpenSSL::SSL::VERIFY_PEER : OpenSSL::SSL::VERIFY_NONE
        http.cert_store = webhook.ca_certs_store
      end
      http.request(request)
    end
  end
end
