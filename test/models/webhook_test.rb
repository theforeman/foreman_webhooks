# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  class WebhookServiceTest < ActiveSupport::TestCase
    def setup
      User.current = users(:admin)
    end

    let(:webhook) { FactoryBot.create(:webhook) }
    let(:webhook_template) { FactoryBot.create(:webhook_template) }

    test 'password is saved encrypted when created' do
      Webhook.any_instance.expects(:encryption_key).at_least_once.returns('25d224dd383e92a7e0c82b8bf7c985e815f34cf5')
      webhook = Webhook.new(
        name: 'new12345', target_url: 'https://app.example.com',
        user: 'username', password: 'abcdef', events: 'host_created.event.foreman',
        webhook_template_id: webhook_template.id
      )
      as_admin do
        assert webhook.save!
      end
      assert_equal webhook.password, 'abcdef'
      refute_equal webhook.password_in_db, 'abcdef'
    end

    test 'password is saved encrypted when updated' do
      webhook.expects(:encryption_key).at_least_once.returns('25d224dd383e92a7e0c82b8bf7c985e815f34cf5')
      webhook.password = '123456'
      as_admin do
        assert webhook.save
      end
      assert_equal webhook.password, '123456'
      refute_equal webhook.password_in_db, '123456'
    end
  end
end
