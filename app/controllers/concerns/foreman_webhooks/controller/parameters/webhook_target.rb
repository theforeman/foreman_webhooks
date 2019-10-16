# frozen_string_literal: true

module ForemanWebhooks
  module Controller
    module Parameters
      module WebhookTarget
        extend ActiveSupport::Concern

        class_methods do
          def webhook_target_params_filter
            Foreman::ParameterFilter.new(::WebhookTarget).tap do |filter|
              filter.permit :name, :target_url, events: []
            end
          end
        end

        def webhook_target_params
          self.class.webhook_target_params_filter.filter_params(params, parameter_filter_context)
        end
      end
    end
  end
end
