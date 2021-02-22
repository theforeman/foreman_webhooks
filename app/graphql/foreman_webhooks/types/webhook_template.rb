# frozen_string_literal: true

module ForemanWebhooks
  module Types
    class WebhookTemplate < ::Types::BaseObject
      model_class ::WebhookTemplate

      description 'A Webhook Template'

      global_id_field :id
      timestamps
      field :name, String
      field :template, String
      field :vendor, String
      field :type, String
      field :os_family, String
      field :description, String
      field :snippet, Boolean
      field :locked, Boolean
      field :default, Boolean

      has_many :webhooks, Types::Webhook
    end
  end
end
