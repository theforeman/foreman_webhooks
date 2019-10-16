# frozen_string_literal: true

class CreateWebhookTargets < ActiveRecord::Migration[5.2]
  def change
    create_table :webhook_targets do |t|
      t.string :name, null: false
      t.string :target_url, null: false
      t.string :events, null: false, array: true, index: true

      t.timestamps
    end
  end
end
