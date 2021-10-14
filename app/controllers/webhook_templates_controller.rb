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
    variables = { object: ForemanWebhooks::Renderer::PreviewMock.new }
    renderer = params.delete('force_safemode') ? Foreman::Renderer::SafeModeRenderer : Foreman::Renderer
    safe_render(@template, Foreman::Renderer::PREVIEW_MODE, renderer, escape_json: true, variables: variables)
  end
end
