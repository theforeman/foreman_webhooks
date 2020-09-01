# frozen_string_literal: true

PayloadTemplate.without_auditing do
  SeedHelper.import_templates(
    Dir[File.join("#{ForemanWebhooks::Engine.root}/app/views/foreman_webhooks/payload_templates/**/*.erb")]
  )
end
