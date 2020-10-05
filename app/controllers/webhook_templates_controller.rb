# frozen_string_literal: true

class WebhookTemplatesController < TemplatesController
  include ForemanWebhooks::Controller::Parameters::WebhookTemplate
end
