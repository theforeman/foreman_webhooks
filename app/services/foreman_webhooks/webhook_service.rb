# frozen_string_literal: true

module ForemanWebhooks
  class WebhookService
    attr_accessor :webhook, :event_name, :payload

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
      request['Content-Type'] = webhook.http_content_type
      request.body = payload

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.scheme == 'https')

      http.request(request)
    end
  end
end
