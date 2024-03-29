# frozen_string_literal: true

module Api
  module V2
    class WebhooksController < V2::BaseController
      include Api::Version2
      include ForemanWebhooks::Controller::Parameters::Webhook

      before_action :find_resource, only: %i[show destroy test]

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
          # If you need to have the list of the events documented, you can run:
          # $ apipie:cache RAILS_ENV=production
          if Rails.env.development?
            param :event, String, required: true
          else
            events = Webhook.available_events.sort.map { |e| e.delete_suffix(Webhook::EVENT_POSTFIX) }
            param :event, events, required: true
          end
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

      api :POST, '/webhooks/:id/test', N_('Test a Webhook')
      param :id, :identifier, required: true
      param :payload, String, N_('Test payload will be sent as is. Cant be a JSON object')
      def test
        result = @webhook.test(payload: params[:payload])
        if result[:status] == :success
          respond_with @webhook, responder: ApiResponder, status: :ok
        else
          render_error('custom_error', status: :unprocessable_entity, locals: { message: result[:message] })
        end
      end

      private

      def action_permission
        case params[:action]
        when 'test'
          'edit'
        else
          super
        end
      end
    end
  end
end
