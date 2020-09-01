# frozen_string_literal: true

class WebhooksController < ::ApplicationController
  include ForemanWebhooks::Controller::Parameters::Webhook

  before_action :find_resource, only: %i[edit update destroy]

  def index
    @webhooks = resource_base.all
  end

  def new
    @webhook = Webhook.new
  end

  def create
    @webhook = Webhook.new(webhook_params)
    if @webhook.save
      process_success
    else
      process_error
    end
  end

  def edit; end

  def update
    if @webhook.update(webhook_params)
      process_success
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
