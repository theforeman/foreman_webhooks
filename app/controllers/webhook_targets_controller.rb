# frozen_string_literal: true

class WebhookTargetsController < ::ApplicationController
  include ForemanWebhooks::Controller::Parameters::WebhookTarget

  before_action :find_resource, only: %i[edit update destroy]

  def index
    @webhook_targets = resource_base.all
  end

  def new
    @webhook_target = WebhookTarget.new
  end

  def create
    @webhook_target = WebhookTarget.new(webhook_target_params)
    if @webhook_target.save
      process_success
    else
      process_error
    end
  end

  def edit; end

  def update
    if @webhook_target.update(webhook_target_params)
      process_success
    else
      process_error
    end
  end

  def destroy
    if @webhook_target.destroy
      process_success
    else
      process_error
    end
  end
end
