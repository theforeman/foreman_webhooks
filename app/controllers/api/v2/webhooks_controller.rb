# frozen_string_literal: true

module Api
  module V2
    class WebhooksController < V2::BaseController
      include Api::Version2
      include ForemanWebhooks::Controller::Parameters::Webhook

      before_action :find_resource, only: %i[show destroy]

      api :GET, '/webhooks/', N_('List Webhooks')
      param_group :search_and_pagination, ::Api::V2::BaseController
      add_scoped_search_description_for(Webhook)
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
          events = Webhook.available_events.sort.map { |e| e.delete_suffix(Webhook::EVENT_POSTFIX) }
          param :event, events, required: true
          param :webhook_template_id, :identifier
          param :enabled, :boolean
          param :verify_ssl, :boolean
          param :ssl_ca_certs, String, N_('X509 Certification Authorities concatenated in PEM format')
          param :user, String
          param :password, String
          param :http_headers, String
          param :proxy_authorization, :boolean, N_('Authorize with Foreman client certificate and validate smart-proxy CA from Settings')
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
        @webhook = Webhook.find(params[:id])
        process_response @webhook.update(webhook_params)
      end

      api :DELETE, '/webhooks/:id', N_('Delete a Webhook')
      param :id, :identifier, required: true
      def destroy
        process_response @webhook.destroy
      end

      api :GET, '/webhooks/events', N_('List available events for subscription')
      def events
        render json: Webhook.available_events.sort.map { |e| e.delete_suffix(Webhook::EVENT_POSTFIX) }.to_json
      end
    end
  end
end
