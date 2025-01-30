# frozen_string_literal: true

module ForemanWebhooks
  module Renderer
    module Scope
      class WebhookTemplate < ::Foreman::Renderer::Scope::Template
        extend ApipieDSL::Class

        apipie :class, 'Macros related to Webhook payload customization' do
          name 'Webhook Template'
          sections only: %w[all webhooks]
        end

        def initialize(**args)
          super
          @defaults = {
            event_name: @event_name,
            webhook_id: @webhook_id,
            context: @context
          }
        end

        apipie :method, 'Creates final payload' do
          optional :hash, Hash, 'Key:value object with with data that should be present in payload', default: {}
          keyword :with_defaults, [true, false], 'If set to true, adds default entries to the payload', default: true
          kwlist :kwargs, 'Additional key:value pairs that should be added to the payload'
          returns String, 'JSON string with the final payload'
          example 'payload({ id: @object.id, name: @object.name }) #=> ' \
                  '"{ "id": 1, "name": "host.example.com", "context": { ... }, ' \
                  '"event_name": "host_created.event.foreman" }"'
        end
        def payload(hash = {}, with_defaults: true, **kwargs)
          raise ArgumentError, 'The first argument must be either a hash or a comma-separated list with key:value pairs' unless hash.is_a?(Hash)
          hash.merge!(kwargs)
          hash.merge!(@defaults) if with_defaults
          hash.to_json
        end
      end
    end
  end
end
