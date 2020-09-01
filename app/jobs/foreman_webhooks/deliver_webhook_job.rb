# frozen_string_literal: true

module ForemanWebhooks
  class DeliverWebhookJob < ::ApplicationJob
    queue_as :default

    def perform(options)
      webhook = Webhook.unscoped.find_by(id: options[:webhook_id])
      WebhookService.new(webhook: webhook, event_name: options[:event_name], payload: options[:payload]).execute
    end

    def webhook_id
      arguments.first['webhook_id'] unless arguments.first.nil?
    end

    def humanized_name
      webhook = webhook_id && Webhook.unscoped.find_by(id: webhook_id)
      (webhook && (_('Deliver webhook %s') % webhook.name)) || _('Deliver webhook')
    end
  end
end
