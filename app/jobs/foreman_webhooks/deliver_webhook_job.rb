# frozen_string_literal: true

module ForemanWebhooks
  class DeliverWebhookJob < ::ApplicationJob
    queue_as :default

    def perform(options)
      webhook = Webhook.unscoped.find_by(id: options[:webhook_id])
      result = WebhookService.new(
        webhook: webhook,
        headers: options[:headers],
        url: options[:url],
        event_name: options[:event_name],
        payload: options[:payload]
      ).execute

      return unless result[:status] == :error

      raise [result[:http_status], result[:message]].compact.join(': ')
    end

    rescue_from(StandardError) do |error|
      Foreman::Logging.logger('background').error(
        'DeliverWebhook: '\
        "Error while delivering - #{error.message}"
      )
      raise error # propagate the error to the tasking system to properly report it there
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
