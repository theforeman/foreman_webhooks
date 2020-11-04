# frozen_string_literal: true

module Api
  module V2
    class WebhooksController < V2::BaseController
      include Api::Version2
      include ForemanWebhooks::Controller::Parameters::Webhook
      include Foreman::Controller::TemplateImport

      before_action :find_resource, only: %i[show update destroy]

      api :GET, '/webhooks/', N_('List Webhooks')
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @webhooks = resource_scope_for_index
      end

      api :GET, '/webhooks/:id', N_('Show Webhook details')
      param :id, :identifier, required: true
      def show; end

      def_param_group :webhook do
        param :webhook, Hash, action_aware: true, required: true do
          param :name, String, required: true
          param :target_url, String, required: true
          param :http_method, Webhook::ALLOWED_HTTP_METHODS
          param :http_content_type, String
          param :event, String, required: true
          param :webhook_template_id, :identifier
          param :enabled, :boolean
          param :verify_ssl, :boolean
          param :ssl_ca_certs, String, N_('X509 Certification Authorities concatenated in PEM format')
          param :user, String
          param :password, String
        end
      end

      api :POST, '/webhooks/', N_('Create a Webhook')
      param_group :webhook, as: :create

      def create
        @webhook = Webhook.new(webhook_params)
        process_response @webhook.save
      end

      api :PUT, '/webhooks/:id', N_('Update a Webhook')
      param :id, :identifier, required: true
      param_group :webhook, as: :update
      def update
        process_response @webhook.update(webhook_params)
      end

      api :DELETE, '/webhooks/:id', N_('Delete a Webhook')
      param :id, :identifier, required: true
      def destroy
        process_response @webhook.destroy
      end
    end
  end
end
