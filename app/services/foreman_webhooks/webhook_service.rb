# frozen_string_literal: true

module ForemanWebhooks
  class WebhookService
    attr_accessor :webhook_target, :event_name, :payload

    def initialize(webhook_target:, event_name:, payload:)
      @webhook_target = webhook_target
      @event_name = event_name
      @payload = payload
    end

    def execute
      response = request(webhook_target.target_url, payload)

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
      Foreman::Logging.exception("Failed to execute the webhook #{webhook_target.name} -> #{event_name}", e)
      {
        status: :error,
        message: e.to_s
      }
    end

    private

    def request(endpoint, payload)
      uri = URI.parse(endpoint)

      request = Net::HTTP::Post.new(uri.request_uri)
      request['Content-Type'] = 'application/json'
      request.body = payload

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.scheme == 'https')

      http.request(request)
    end
  end
end
