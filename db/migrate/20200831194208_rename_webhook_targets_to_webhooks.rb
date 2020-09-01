# frozen_string_literal: true

class RenameWebhookTargetsToWebhooks < ActiveRecord::Migration[6.0]
  def change
    rename_table :webhook_targets, :webhooks
  end
end
