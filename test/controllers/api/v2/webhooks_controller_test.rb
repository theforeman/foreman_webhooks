# frozen_string_literal: true

require 'test_plugin_helper'

class Api::V2::WebhooksControllerTest < ActionController::TestCase
  valid_attrs = { name: 'webhook_test', event: 'host_created.event.foreman',
                  target_url: 'https://app.example.com' }

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

  test 'should destroy webhook' do
    assert_difference('Webhook.unscoped.count', -1) do
      delete :destroy, params: { id: @webhook.to_param }
    end
    assert_response :success
  end
end
