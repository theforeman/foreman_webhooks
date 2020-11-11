# frozen_string_literal: true

class AddHttpHeaders < ActiveRecord::Migration[6.0]
  def change
    # HTTP headers stored as JSON: {"header_name": "value"}
    add_column :webhooks, :http_headers, :text, null: true
  end
end
