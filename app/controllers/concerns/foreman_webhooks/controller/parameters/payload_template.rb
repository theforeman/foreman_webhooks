# frozen_string_literal: true

module ForemanWebhooks
  module Controller
    module Parameters
      module PayloadTemplate
        extend ActiveSupport::Concern
        include Foreman::Controller::Parameters::Taxonomix
        include Foreman::Controller::Parameters::Template

        class_methods do
          def payload_template_params_filter
            Foreman::ParameterFilter.new(::PayloadTemplate).tap do |filter|
              add_taxonomix_params_filter(filter)
              add_template_params_filter(filter)
            end
          end
        end

        def payload_template_params
          self.class.payload_template_params_filter.filter_params(params, parameter_filter_context)
        end

        def organization_params
          self.class.organization_params_filter(::PayloadTemplate).filter_params(params, parameter_filter_context)
        end

        def location_params
          self.class.location_params_filter(::PayloadTemplate).filter_params(params, parameter_filter_context)
        end
      end
    end
  end
end
