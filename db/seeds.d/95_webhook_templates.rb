# frozen_string_literal: true

WebhookTemplate.without_auditing do
  SeedHelper.import_templates(
    Dir[File.join("#{ForemanWebhooks::Engine.root}/app/views/foreman_webhooks/webhook_templates/**/*.erb")]
  )
end
