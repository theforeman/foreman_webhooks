# frozen_string_literal: true

module Api
  module V2
    class WebhookTargetsController < V2::BaseController
      include Api::Version2
      include ForemanWebhooks::Controller::Parameters::WebhookTarget

      before_action :find_resource, only: %i[show update destroy]

      api :GET, '/webhook_targets/', N_('List Webhook Targets')
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @webhook_targets = resource_scope_for_index
      end

      api :GET, '/webhook_targets/:id', N_('Show Webhook Target details')
      param :id, :identifier, required: true
      def show; end

      def_param_group :webhook_target do
        param :webhook_target, Hash, action_aware: true, required: true do
          param :name, String, required: true
          param :target_url, String, required: true
          param :events, Array, required: true
        end
      end

      api :POST, '/webhook_targets/', N_('Create a Webhook Target')
      param_group :webhook_target, as: :create

      def create
        @webhook_target = Webhook Target.new(webhook_target_params)
        process_response @webhook_target.save
      end

      api :PUT, '/webhook_targets/:id', N_('Update a Webhook Target')
      param :id, :identifier, required: true
      param_group :webhook_target
      def update
        process_response @webhook_target.update(webhook_target_params)
      end

      api :DELETE, '/webhook_targets/:id', N_('Delete a Webhook Target')
      param :id, :identifier, required: true
      def destroy
        process_response @webhook_target.destroy
      end

      private

      # Overload this method to avoid using search_for method
      def resource_scope_for_index(options = {})
        resource_scope(options).paginate(paginate_options)
      end
    end
  end
end
