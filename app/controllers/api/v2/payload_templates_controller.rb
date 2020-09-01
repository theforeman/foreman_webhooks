# frozen_string_literal: true

module Api
  module V2
    class PayloadTemplatesController < V2::BaseController
      include Api::Version2
      include ForemanWebhooks::Controller::Parameters::PayloadTemplate

      before_action :find_resource, only: %i[show update destroy]

      api :GET, '/payload_templates/', N_('List payload templates')
      param_group :search_and_pagination, ::Api::V2::BaseController
      add_scoped_search_description_for(PayloadTemplate)
      def index
        @payload_templates = resource_scope_for_index
      end

      api :GET, '/payload_templates/:id', N_('Show payload template details')
      param :id, :identifier, required: true
      def show; end

      def_param_group :payload_template do
        param :payload_template, Hash, action_aware: true, required: true do
        param :name, String, required: true
        param :description, String
        param :template, String, required: true
        param :snippet, :bool, allow_nil: true
        param :audit_comment, String, allow_nil: true
        param :locked, :bool, desc: N_('Whether or not the template is locked for editing')
        param :default, :bool, desc: N_('Whether or not the template is added automatically to new organizations and locations')
        param_group :taxonomies, ::Api::V2::BaseController
        end
      end

      def_param_group :payload_template_clone do
        param :payload_template, Hash, required: true, action_aware: true do
          param :name, String, required: true, desc: N_('Template name')
        end
      end

      api :POST, '/payload_templates/', N_('Create a payload template')
      param_group :payload_template, as: :create
      def create
        @payload_template = PayloadTemplate.new(payload_template_params)
        process_response @payload_template.save
      end

      api :POST, '/payload_templates/import', N_('Import a payload template')
      param :payload_template, Hash, required: true, action_aware: true do
        param :name, String, required: true, desc: N_('Template name')
        param :template, String, required: true, desc: N_('Template contents including metadata')
        param_group :taxonomies, ::Api::V2::BaseController
      end
      param_group :template_import_options, ::Api::V2::BaseController
      def import
        @payload_template = PayloadTemplate.import!(*import_attrs_for(:payload_template))
        process_response @payload_template
      end

      api :PUT, '/payload_templates/:id', N_('Update a payload template')
      param :id, :identifier, required: true
      param_group :payload_template, as: :update
      def update
        process_response @payload_template.update(payload_template_params)
      end

      api :DELETE, '/payload_templates/:id', N_('Delete a payload template')
      param :id, :identifier, required: true
      def destroy
        process_response @payload_template.destroy
      end

      api :POST, '/payload_templates/:id/clone', N_('Clone a template')
      param :id, :identifier, required: true
      param_group :payload_template_clone, as: :create
      def clone
        @payload_template = @payload_template.dup
        @payload_template.name = params[:payload_template][:name]
        process_response @payload_template.save
      end

      api :GET, '/payload_templates/:id/export', N_('Export a payload template to ERB')
      param :id, :identifier, required: true
      def export
        send_data @payload_template.to_erb, type: 'text/plain', disposition: 'attachment', filename: @payload_template.filename
      end

      private

      # Overload this method to avoid using search_for method
      def resource_scope_for_index(options = {})
        resource_scope(options).paginate(paginate_options)
      end

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
