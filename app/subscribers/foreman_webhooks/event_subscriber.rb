# frozen_string_literal: true

module ForemanWebhooks
  class EventSubscriber < ::Foreman::BaseSubscriber
    def call(event)
      WebhookTarget.deliver(event_name: event.name, payload: event.payload.to_json)
    end
  end
end
