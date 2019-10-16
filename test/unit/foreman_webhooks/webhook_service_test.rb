# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  class WebhookServiceTest < ActiveSupport::TestCase
    let(:event_name) { 'subnet_created' }
    let(:payload) { { id: 2 }.to_json }
    let(:webhook_target) { FactoryBot.build(:webhook_target) }
    let(:webhook_service) do
      WebhookService.new(
        webhook_target: webhook_target,
        event_name: event_name,
        payload: payload
      )
    end

    it 'executes a request to the configured webhook target' do
      expected = { status: :success, message: '', http_status: 200 }

      stub_request(:post, 'https://hook.example.com/api/callback')
        .with(
          body: payload,
          headers: {
            'Content-Type' => 'application/json'
          }
        )
        .to_return(status: 200, body: '', headers: {})

      assert_equal expected, webhook_service.execute
    end

    it 'handles a failed request' do
      expected = { status: :error, message: '', http_status: 404 }

      stub_request(:post, 'https://hook.example.com/api/callback')
        .with(
          body: payload,
          headers: {
            'Content-Type' => 'application/json'
          }
        )
        .to_return(status: 404, body: '', headers: {})

      assert_equal expected, webhook_service.execute
    end
  end
end
