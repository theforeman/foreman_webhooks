# frozen_string_literal: true

class AddTemplateToWebhooks < ActiveRecord::Migration[6.0]
  def change
    add_reference :webhooks, :webhook_template, foreign_key: { to_table: :templates }
  end
end
