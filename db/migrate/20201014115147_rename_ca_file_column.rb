# frozen_string_literal: true

class RenameCaFileColumn < ActiveRecord::Migration[6.0]
  def change
    rename_column :webhooks, :ssl_ca_file, :ssl_ca_certs
  end
end
