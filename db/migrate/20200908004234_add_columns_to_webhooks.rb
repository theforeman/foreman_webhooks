class AddColumnsToWebhooks < ActiveRecord::Migration[6.0]
  def change
    add_column :webhooks, :http_method, :string, default: 'POST', null: false
    add_column :webhooks, :http_content_type, :string, default: 'application/json', null: false
  end
end
