class AddColumnsToWebhooks < ActiveRecord::Migration[6.0]
  def change
    add_column :webhooks, :http_method, :string, default: 'POST', null: false
    add_column :webhooks, :http_content_type, :string, default: 'application/json', null: false
    add_column :webhooks, :enabled, :boolean, default: true
    add_column :webhooks, :verify_ssl, :boolean, default: true
    add_column :webhooks, :ssl_ca_file, :text, null: true
    add_column :webhooks, :user, :string, null: true
    add_column :webhooks, :password, :text, null: true
  end
end
