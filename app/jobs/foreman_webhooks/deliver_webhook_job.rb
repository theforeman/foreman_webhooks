# frozen_string_literal: true

module ForemanWebhooks
  class DeliverWebhookJob < ::ApplicationJob
    queue_as :default

    def perform(options)
      webhook_target = WebhookTarget.unscoped.find_by(id: options[:webhook_target_id])
      WebhookService.new(webhook_target: webhook_target, event_name: options[:event_name], payload: options[:payload]).execute
    end

    def webhook_target_id
      arguments.first['webhook_target_id'] unless arguments.first.nil?
    end

    def humanized_name
      webhook_target = webhook_target_id && WebhookTarget.unscoped.find_by(id: webhook_target_id)
      (webhook_target && (_('Deliver webhook %s') % webhook_target.name)) || _('Deliver webhook')
    end
  end
end
