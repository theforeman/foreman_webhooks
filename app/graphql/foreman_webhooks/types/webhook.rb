# frozen_string_literal: true

module ForemanWebhooks
  module Types
    class Webhook < ::Types::BaseObject
      model_class ::Webhook

      description 'A Webhook'

      global_id_field :id
      timestamps
      field :name, String
      field :events, [String]
      field :target_url, String
      field :http_method, String
      field :http_content_type, String
      field :enabled, Boolean
      field :verify_ssl, Boolean
      field :enabled, Boolean
      field :ssl_ca_certs, String
      field :user, String

      belongs_to :webhook_template, Types::WebhookTemplate
    end
  end
end
