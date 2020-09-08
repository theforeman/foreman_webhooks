# frozen_string_literal: true

object @webhooks

extends 'api/v2/webhooks/main'

attributes :target_url, :events, :http_method, :http_content_type

child :payload_template do
  extends 'api/v2/payload_templates/base'
end
