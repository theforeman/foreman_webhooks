# frozen_string_literal: true

object @webhook

extends 'api/v2/webhooks/main'

attributes :target_url,
           :event,
           :http_method,
           :http_content_type,
           :enabled,
           :verify_ssl,
           :proxy_authorization,
           :http_headers,
           :ssl_ca_certs,
           :user

node :password_set do |webhook|
  webhook.password.present?
end

child :webhook_template do
  extends 'api/v2/webhook_templates/base'
end
