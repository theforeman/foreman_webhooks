# frozen_string_literal: true

class WebhooksController < ::ApplicationController
  include ForemanWebhooks::Controller::Parameters::Webhook
  include Foreman::Controller::AutoCompleteSearch

  before_action :find_resource, only: %i[edit update destroy]

  def new
    @webhook = Webhook.new
  end

  def create
    @webhook = Webhook.new(webhook_params)
    if @webhook.save
      process_success success_redirect: '/webhooks'
    else
      process_error
    end
  end

  def edit; end

  def update
    if @webhook.update(webhook_params)
      process_success success_redirect: '/webhooks'
    else
      process_error
    end
  end

  def destroy
    if @webhook.destroy
      process_success
    else
      process_error
    end
  end
end
