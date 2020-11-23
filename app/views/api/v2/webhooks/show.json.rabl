# frozen_string_literal: true

object @webhook

extends 'api/v2/webhooks/main'

attributes :target_url,
           :event,
           :http_method,
           :http_content_type,
           :enabled,
           :verify_ssl,
           :http_headers

child :webhook_template do
  extends 'api/v2/webhook_templates/base'
end
