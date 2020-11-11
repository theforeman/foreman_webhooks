# frozen_string_literal: true

module ForemanWebhooks
  module Controller
    module Parameters
      module Webhook
        extend ActiveSupport::Concern

        class_methods do
          def webhook_params_filter
            Foreman::ParameterFilter.new(::Webhook).tap do |filter|
              filter.permit :name,
                            :target_url,
                            :webhook_template_id,
                            :event,
                            :http_method,
                            :http_content_type,
                            :enabled,
                            :verify_ssl,
                            :ssl_ca_certs,
                            :user,
                            :password,
                            :http_headers
            end
          end
        end

        def webhook_params
          self.class.webhook_params_filter.filter_params(params, parameter_filter_context)
        end
      end
    end
  end
end
