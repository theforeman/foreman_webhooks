# frozen_string_literal: true

class WebhookTemplatesController < TemplatesController
  include ForemanWebhooks::Controller::Parameters::WebhookTemplate

  def preview
    if params[:id]
      find_resource
    else
      @template = resource_class.new(params[type_name_plural])
    end
    @template.template = params[:template]
    # TODO: update for multiple events when webhooks support multiple events
    id_event_model = @template.webhooks.map { |webhook| { webhook_id: webhook.id, event_name: webhook.events.first } }
                              .uniq { |id_event| id_event[:event_name] }.map do |id_event|
      # TODO: This could be id_event => { webhook_id:, event_name: }
      webhook_id = id_event[:webhook_id]
      event_name = id_event[:event_name]
      model = event_name.delete_suffix(Webhook::EVENT_POSTFIX).rpartition('_').first.tr('.', '/').classify.safe_constantize
      next unless model

      { webhook_id: webhook_id, event_name: event_name, model: model }
    end.compact.sample

    # TODO: This could be id_event_model => { webhook_id:, event_name:, model: }
    webhook_id = id_event_model[:webhook_id]
    event_name = id_event_model[:event_name]
    model = id_event_model[:model]
    # TODO: Find a way to get a sample for Actions
    # RANDOM() works only on PostgreSQL
    object = model < ApplicationRecord ? model.order("RANDOM()").limit(1).first : model
    context = ::Logging.mdc.context.symbolize_keys
    # TODO: Waits for Ruby 3.1+ syntax
    variables = {
      event_name: event_name,
      object: object,
      context: context,
      payload: { object: object, context: context },
      webhook_id: webhook_id,
    }
    renderer = params.delete('force_safemode') ? Foreman::Renderer::SafeModeRenderer : Foreman::Renderer
    safe_render(@template, Foreman::Renderer::PREVIEW_MODE, renderer, escape_json: true, variables: variables)
  end
end
