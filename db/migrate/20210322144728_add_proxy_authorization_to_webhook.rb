# frozen_string_literal: true

class AddProxyAuthorizationToWebhook < ActiveRecord::Migration[6.0]
  def change
    add_column :webhooks, :proxy_authorization, :boolean, null: false, default: false
  end
end
