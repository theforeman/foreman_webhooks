module ForemanWebhooks
  class EventObserver
    def notify(event_name:, payload:)
      WebhookTarget.deliver(event_name: event_name, payload: payload.to_json)
    end
  end
end
