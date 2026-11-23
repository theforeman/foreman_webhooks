# frozen_string_literal: true

require 'test_plugin_helper'

class Api::V2::WebhooksControllerTest < ActionController::TestCase
  valid_attrs = { name: 'webhook_test', event: 'host_created.event.foreman',
                  target_url: 'https://app.example.com', http_method: 'POST' }

  def setup
    @webhook = FactoryBot.create(:webhook)
    @webhook_template = FactoryBot.create(:webhook_template)
  end

  let(:webhook) { FactoryBot.create(:webhook) }

  test 'should get index' do
    get :index
    assert_response :success
    assert_not_nil assigns(:webhooks)
    webhooks = ActiveSupport::JSON.decode(@response.body)
    assert !webhooks.empty?
    webhook = webhooks['results'].find { |h| h['id'] == @webhook.id }
    assert_equal @webhook.name, webhook['name']
  end

  test 'should show individual record' do
    get :show, params: { id: @webhook.to_param }
    assert_response :success
    show_response = ActiveSupport::JSON.decode(@response.body)
    assert !show_response.empty?
    assert_equal @webhook.event, show_response['event']
  end

  test 'should create webhook' do
    assert_difference('Webhook.unscoped.count') do
      post :create, params: { webhook: valid_attrs.merge(webhook_template_id: @webhook_template.id) }
    end
    assert_response :created
    response = JSON.parse(@response.body)
    assert response.key?('name')
    assert response.key?('event')
    assert_equal response['name'], valid_attrs[:name]
    assert_equal response['event'], valid_attrs[:event]
    assert response['enabled']
    assert Webhook.find(response['id']).enabled?
  end

  test 'should update name' do
    new_name = 'new webhook name'
    put :update, params: { id: @webhook.id, webhook: { name: new_name } }
    assert_response :success
    response = JSON.parse(@response.body)
    assert response.key?('name')
    assert_equal response['name'], new_name
  end

  test 'should update event' do
    new_event = 'subnet_created.event.foreman'
    put :update, params: { id: @webhook.id, webhook: { event: new_event } }
    assert_response :success
    response = JSON.parse(@response.body)
    assert response.key?('event')
    assert_equal response['event'], new_event
  end

  # Migrated from Robottelo tests/foreman/cli/test_webhook.py::TestWebhook::test_webhook_disabled_enabled (state transitions).
  test 'should disable and enable webhook' do
    assert @webhook.enabled?

    put :update, params: { id: @webhook.id, webhook: { enabled: false } }
    assert_response :success
    response = JSON.parse(@response.body)
    assert_equal false, response['enabled']
    assert_not @webhook.reload.enabled?

    put :update, params: { id: @webhook.id, webhook: { enabled: true } }
    assert_response :success
    response = JSON.parse(@response.body)
    assert response['enabled']
    assert @webhook.reload.enabled?
  end

  test 'should not create with invalid name' do
    assert_difference('Webhook.unscoped.count', 0) do
      post :create, params: { webhook: valid_attrs.merge(name: '') }
    end
    assert_response :unprocessable_entity
  end

  test 'should not create with invalid event' do
    assert_difference('Webhook.unscoped.count', 0) do
      post :create, params: { webhook: valid_attrs.merge(event: '') }
    end
    assert_response :unprocessable_entity
  end

  test 'should not update with invalid name' do
    put :update, params: { id: @webhook.id, webhook: { name: '' } }
    assert_response :unprocessable_entity
  end

  test 'should not update with invalid event' do
    put :update, params: { id: @webhook.id, webhook: { event: '' } }
    assert_response :unprocessable_entity
  end

  # Migrated from Robottelo tests/foreman/cli/test_webhook.py::TestWebhook::test_negative_update_invalid_url.
  test 'should not update with invalid target_url' do
    original_url = @webhook.target_url
    put :update, params: { id: @webhook.id, webhook: { target_url: '$%^##@***' } }
    assert_response :unprocessable_entity
    assert_equal original_url, @webhook.reload.target_url
  end

  test 'search webhook' do
    get :index, params: { search: @webhook.name, format: 'json' }
    assert_response :success, "search webhook name: '#{@webhook.name}'" \
                              " failed with code: #{@response.code}"
    response = JSON.parse(@response.body)
    assert_equal response['results'].length, 1
    assert_equal response['results'][0]['id'], @webhook.id
  end

  test 'should update webhook' do
    put :update, params: { id: @webhook.to_param, webhook: valid_attrs }
    assert_response :success
  end

  # Migrated from Robottelo tests/foreman/api/test_webhook.py::TestWebhook::test_positive_valid_method.
  test 'should create webhook with valid http_method' do
    %w[POST GET PUT DELETE PATCH].each do |method|
      assert_difference('Webhook.unscoped.count') do
        post :create, params: { webhook: valid_attrs.merge(http_method: method, webhook_template_id: @webhook_template.id) }
      end
      assert_response :created
      response = JSON.parse(@response.body)
      assert_equal response['http_method'], method
    end
  end

  # Migrated from Robottelo tests/foreman/api/test_webhook.py::TestWebhook::test_negative_invalid_method.
  test 'should not create webhooks with invalid http_method' do
    assert_difference('Webhook.unscoped.count', 0) do
      post :create, params: { webhook: valid_attrs.merge(http_method: 'INVALID', webhook_template_id: @webhook_template.id) }
    end
    assert_response :unprocessable_entity
  end

  # Migrated from Robottelo tests/foreman/api/test_webhook.py::TestWebhook::test_positive_end_to_end (HTTP method update).
  test 'should update http_method' do
    put :update, params: { id: @webhook.id, webhook: { http_method: 'PUT' } }
    assert_response :success
    response = JSON.parse(@response.body)
    assert response.key?('http_method')
    assert_equal response['http_method'], 'PUT'
  end

  # Migrated from Robottelo tests/foreman/api/test_webhook.py::TestWebhook::test_negative_invalid_method (HTTP method validation on update).
  test 'should not update with invalid http_method' do
    put :update, params: { id: @webhook.id, webhook: { http_method: 'INVALID' } }
    assert_response :unprocessable_entity
  end

  test 'should destroy webhook' do
    assert_difference('Webhook.unscoped.count', -1) do
      delete :destroy, params: { id: @webhook.to_param }
    end
    assert_response :success
  end
end
