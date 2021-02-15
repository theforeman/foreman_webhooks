# frozen_string_literal: true

class WebhooksController < ::ApplicationController
  include ForemanWebhooks::Controller::Parameters::Webhook
  include Foreman::Controller::AutoCompleteSearch

  before_action :find_resource, only: %i[destroy]

  def destroy
    if @webhook.destroy
      process_success
    else
      process_error
    end
  end
end
