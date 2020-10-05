# frozen_string_literal: true

class RenameWebhookPermissions < ActiveRecord::Migration[6.0]
  PERMISSIONS = {
    'view_webhook_targets' => 'view_webhooks',
    'create_webhook_targets' => 'create_webhooks',
    'edit_webhook_targets' => 'edit_webhooks',
    'destroy_webhook_targets' => 'destroy_webhooks'
  }.freeze

  def up
    PERMISSIONS.each do |from, to|
      Permission.unscoped.find_by(name: from)&.update_columns(name: to)
    end
  end

  def down
    PERMISSIONS.each do |from, to|
      Permission.unscoped.find_by(name: to)&.update_columns(name: from)
    end
  end
end
