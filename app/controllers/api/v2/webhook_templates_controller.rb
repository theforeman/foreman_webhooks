# frozen_string_literal: true

module Api
  module V2
    class WebhookTemplatesController < V2::BaseController
      include Api::Version2
      include ForemanWebhooks::Controller::Parameters::WebhookTemplate
      include Foreman::Controller::TemplateImport

      before_action :find_resource, only: %i[show update destroy clone export]

      api :GET, '/webhook_templates/', N_('List webhook templates')
      param_group :search_and_pagination, ::Api::V2::BaseController
      add_scoped_search_description_for(WebhookTemplate)
      def index
        @webhook_templates = resource_scope_for_index
      end

      api :GET, '/webhook_templates/:id', N_('Show webhook template details')
      param :id, :identifier, required: true
      def show; end

      def_param_group :webhook_template do
        param :webhook_template, Hash, action_aware: true, required: true do
          param :name, String, required: true
          param :description, String
          param :template, String, required: true
          param :snippet, :bool, allow_nil: true
          param :audit_comment, String, allow_nil: true
          param :locked, :bool, desc: N_('Whether or not the template is locked for editing')
          param :default, :bool,
                desc: N_('Whether or not the template is added automatically to new organizations and locations')
          param_group :taxonomies, ::Api::V2::BaseController
        end
      end

      def_param_group :webhook_template_clone do
        param :webhook_template, Hash, required: true, action_aware: true do
          param :name, String, required: true, desc: N_('Template name')
        end
      end

      api :POST, '/webhook_templates/', N_('Create a webhook template')
      param_group :webhook_template, as: :create
      def create
        @webhook_template = WebhookTemplate.new(webhook_template_params)
        process_response @webhook_template.save
      end

      api :POST, '/webhook_templates/import', N_('Import a webhook template')
      param :webhook_template, Hash, required: true, action_aware: true do
        param :name, String, required: true, desc: N_('Template name')
        param :template, String, required: true, desc: N_('Template contents including metadata')
        param_group :taxonomies, ::Api::V2::BaseController
      end
      param_group :template_import_options, ::Api::V2::BaseController
      def import
        @webhook_template = WebhookTemplate.import!(*import_attrs_for(:webhook_template))
        process_response @webhook_template
      end

      api :PUT, '/webhook_templates/:id', N_('Update a webhook template')
      param :id, :identifier, required: true
      param_group :webhook_template, as: :update
      def update
        process_response @webhook_template.update(webhook_template_params)
      end

      api :DELETE, '/webhook_templates/:id', N_('Delete a webhook template')
      param :id, :identifier, required: true
      def destroy
        process_response @webhook_template.destroy
      end

      api :POST, '/webhook_templates/:id/clone', N_('Clone a template')
      param :id, :identifier, required: true
      param_group :webhook_template_clone, as: :create
      def clone
        @webhook_template = @webhook_template.dup
        @webhook_template.name = params[:webhook_template][:name]
        process_response @webhook_template.save
      end

      api :GET, '/webhook_templates/:id/export', N_('Export a webhook template to ERB')
      param :id, :identifier, required: true
      def export
        send_data @webhook_template.to_erb, type: 'text/plain',
                                            disposition: 'attachment',
                                            filename: @webhook_template.filename
      end

      private

      def action_permission
        case params[:action]
        when 'clone', 'import'
          'create'
        when 'export'
          'view'
        else
          super
        end
      end
    end
  end
end
