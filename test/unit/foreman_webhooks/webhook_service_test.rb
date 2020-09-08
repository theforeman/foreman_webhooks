# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  class WebhookServiceTest < ActiveSupport::TestCase
    let(:event_name) { 'subnet_created' }
    let(:payload) { { id: 2 } }
    let(:payload_json) { payload.to_json }
    let(:webhook) { FactoryBot.build(:webhook, :with_template, template: '<%= payload({ id: @payload[:id] }, with_defaults: false) %>') }
    let(:webhook_service) do
      WebhookService.new(
        webhook: webhook,
        event_name: event_name,
        payload: payload_json
      )
    end

    it 'executes a request to the configured webhook' do
      expected = { status: :success, message: '', http_status: 200 }

      stub_request(:post, 'https://hook.example.com/api/callback')
        .with(
          body: payload_json,
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
          body: payload_json,
          headers: {
            'Content-Type' => 'application/json'
          }
        )
        .to_return(status: 404, body: '', headers: {})

      assert_equal expected, webhook_service.execute
    end
  end
end
