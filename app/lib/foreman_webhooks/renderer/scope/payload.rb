# frozen_string_literal: true

module ForemanWebhooks
  module Renderer
    module Scope
      class Payload < ::Foreman::Renderer::Scope::Template
        extend ApipieDSL::Class

        apipie :class, 'Macros related to Webhook payload customization' do
          name 'Payload'
          sections only: %w[all webhooks]
        end

        def initialize(**args)
          super
          @context ||= @payload&.dig(:context)
          @object ||= @payload&.dig(:object)
        end

        apipie :method, 'Converts Hash object to JSON representation' do
          required :hash, Hash, 'Hash object to convert'
          raises error: ArgumentError, desc: 'If the object is not a hash'
          returns String, desc: 'JSON representation of the passsed hash'
          example 'as_json({ id: 1 }) #=> "{\"id\": 1}"'
        end
        def as_json(hash)
          raise ArgumentError, 'Must be a Hash object' unless hash.is_a?(Hash)

          hash.to_json
        end

        def allowed_helpers
          @allowed_helpers ||= super + %i[as_json]
        end
      end
    end
  end
end
