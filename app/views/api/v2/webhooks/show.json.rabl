# frozen_string_literal: true

object @webhooks

extends 'api/v2/webhooks/main'

attributes :target_url, :events, :http_method, :http_content_type

child :webhook_template do
  extends 'api/v2/webhook_templates/base'
end
