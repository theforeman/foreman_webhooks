# frozen_string_literal: true

class PayloadTemplatesController < TemplatesController
  include ForemanWebhooks::Controller::Parameters::PayloadTemplate
end
