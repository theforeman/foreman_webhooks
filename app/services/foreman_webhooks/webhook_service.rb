# frozen_string_literal: true

module ForemanWebhooks
  class WebhookService
    attr_accessor :webhook, :event_name, :payload, :rendered_headers, :rendered_url

    delegate :logger, to: Rails

    def initialize(webhook:, event_name:, payload:, headers:, url:)
      @webhook = webhook
      @event_name = event_name
      @payload = payload
      @rendered_headers = headers
      @rendered_url = url
    end

    def execute
      logger.info("Performing '#{webhook.name}' webhook request for event '#{event_name}'")
      Foreman::Logging.blob("Payload for '#{event_name}'", payload)
      headers = {}
      begin
        headers = JSON.parse(rendered_headers)
      rescue StandardError => e
        logger.warn("Could not parse HTTP headers JSON, ignoring: #{e}")
        logger.debug("Headers: #{rendered_headers}")
      end

      response = self.class.request(url: webhook.target_url,
                                    payload: payload,
                                    http_method: webhook.http_method,
                                    user: webhook.user,
                                    password: webhook.password,
                                    content_type: webhook.http_content_type,
                                    headers: headers,
                                    ca_string: webhook.verify_ssl?,
                                    ca_verify: webhook.ca_certs_store,
                                    follow_redirects: true)

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

    def self.request(url:, payload: '', http_method: :GET, user: nil, password: nil, content_type: 'application/json', headers: {}, ca_string: nil, ca_verify: false, follow_redirects: true, redirect_limit: 3)
      uri = URI.parse(url)

      request = Object.const_get("Net::HTTP::#{http_method.to_s.capitalize}").new(uri.request_uri)
      request.basic_auth(user, password) if user && password
      request['Content-Type'] = content_type
      request['X-Request-Id'] = ::Logging.mdc['request'] || SecureRandom.uuid
      request['X-Session-Id'] = ::Logging.mdc['session'] || SecureRandom.uuid
      headers.each_pair do |key, value|
        request[key.to_s] = value.to_s
      end
      request.body = payload

      Rails.logger.debug("Webhook #{http_method.to_s.upcase} request: #{uri}")
      Rails.logger.debug("Headers: #{request.to_hash.inspect}")
      Rails.logger.debug("Body: #{request.body.inspect}")

      http = Net::HTTP.new(uri.host, uri.port)
      http.open_timeout = Setting[:proxy_request_timeout]
      http.read_timeout = Setting[:proxy_request_timeout]
      http.ssl_timeout = Setting[:proxy_request_timeout]
      if uri.scheme == 'https'
        http.use_ssl = true
        http.verify_mode = ca_verify ? OpenSSL::SSL::VERIFY_PEER : OpenSSL::SSL::VERIFY_NONE
        http.cert_store = ca_string if ca_string
      end
      http.request(request) do |response|
        case response
        when Net::HTTPRedirection then
          new_location = response['location']
          Rails.logger.debug "Redirected to #{new_location} (redirects left: #{redirect_limit})"
          raise(::Foreman::Exception, N_(format('Too many HTTP redirects when calling %{uri}', uri: uri, code: response.code))) if redirect_limit <= 0

          self.request(url: new_location,
                       payload: payload,
                       http_method: http_method,
                       user: user,
                       password: password,
                       content_type: content_type,
                       ca_string: ca_string,
                       ca_verify: ca_verify,
                       headers: headers,
                       follow_redirects: follow_redirects,
                       redirect_limit: redirect_limit - 1)
        else
          response
        end
      end
    end
  end
end
