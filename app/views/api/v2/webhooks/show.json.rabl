# frozen_string_literal: true

object @webhook

extends 'api/v2/webhooks/main'

attributes :event, :http_method, :http_content_type, :verify_ssl

child :webhook_template do
  extends 'api/v2/webhook_templates/base'
end
