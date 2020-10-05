# frozen_string_literal: true

require 'test_plugin_helper'

class Api::V2::WebhookTemplatesControllerTest < ActionController::TestCase
  valid_attrs = { name: 'webhook_template_test', template: 'a,b,c' }

  def setup
    @webhook_template = FactoryBot.create(:webhook_template)
  end

  let(:webhook_template) { FactoryBot.create(:webhook_template) }

  test 'should get index' do
    get :index
    assert_response :success
    assert_not_nil assigns(:webhook_templates)
    webhook_templates = ActiveSupport::JSON.decode(@response.body)
    assert !webhook_templates.empty?
    template = webhook_templates['results'].find { |h| h['id'] == @webhook_template.id }
    assert_equal @webhook_template.name, template['name']
  end

  test 'should show individual record' do
    get :show, params: { id: @webhook_template.to_param }
    assert_response :success
    show_response = ActiveSupport::JSON.decode(@response.body)
    assert !show_response.empty?
    assert_equal @webhook_template['template'], show_response['template']
  end

  test 'should create webhook_template' do
    assert_difference('WebhookTemplate.unscoped.count') do
      post :create, params: { webhook_template: valid_attrs }
    end
    assert_response :created
    response = JSON.parse(@response.body)
    assert response.key?('name')
    assert response.key?('template')
    assert_equal response['name'], valid_attrs[:name]
    assert_equal response['template'], valid_attrs[:template]
  end

  test 'create with template length' do
    valid_params = valid_attrs.merge(template: RFauxFactory.gen_alpha(5000))
    assert_difference('WebhookTemplate.unscoped.count') do
      post :create, params: { webhook_template: valid_params }
    end
    assert_response :created
    response = JSON.parse(@response.body)
    assert response.key?('template')
    assert_equal response['template'], valid_params[:template]
  end

  test 'create with one character name' do
    valid_params = valid_attrs.merge(name: RFauxFactory.gen_alpha(1))
    assert_difference('WebhookTemplate.unscoped.count') do
      post :create, params: { webhook_template: valid_params }
    end
    assert_response :created
    response = JSON.parse(@response.body)
    assert response.key?('name')
    assert_equal response['name'], valid_params[:name]
  end

  test 'should create webhook_template with organization' do
    organization_id = Organization.first.id
    assert_difference('WebhookTemplate.unscoped.count') do
      post :create, params: { webhook_template: valid_attrs.merge(organization_ids: [organization_id]) }
    end
    assert_response :created
    response = JSON.parse(@response.body)
    assert response.key?('organizations')
    organization_ids = response['organizations'].map { |org| org['id'] }
    assert_equal organization_ids.length, 1
    assert_include organization_ids, organization_id
  end

  test 'should update name' do
    new_name = 'new webhook_template name'
    put :update, params: { id: @webhook_template.id, webhook_template: { name: new_name } }
    assert_response :success
    response = JSON.parse(@response.body)
    assert response.key?('name')
    assert_equal response['name'], new_name
  end

  test 'should update template' do
    new_template = 'new webhook_template template'
    put :update, params: { id: @webhook_template.id, webhook_template: { template: new_template } }
    assert_response :success
    response = JSON.parse(@response.body)
    assert response.key?('template')
    assert_equal response['template'], new_template
  end

  test 'should not create with invalid name' do
    assert_difference('WebhookTemplate.unscoped.count', 0) do
      post :create, params: { webhook_template: valid_attrs.merge(name: '') }
    end
    assert_response :unprocessable_entity
  end

  test 'should not create with invalid template' do
    assert_difference('WebhookTemplate.unscoped.count', 0) do
      post :create, params: { webhook_template: valid_attrs.merge(template: '') }
    end
    assert_response :unprocessable_entity
  end

  test 'should not update with invalid name' do
    put :update, params: { id: @webhook_template.id, webhook_template: { name: '' } }
    assert_response :unprocessable_entity
  end

  test 'should not update with invalid template' do
    put :update, params: { id: @webhook_template.id, webhook_template: { template: '' } }
    assert_response :unprocessable_entity
  end

  test 'search webhook_template' do
    get :index, params: { search: @webhook_template.name, format: 'json' }
    assert_response :success, "search webhook_template name: '#{@webhook_template.name}'" \
                              " failed with code: #{@response.code}"
    response = JSON.parse(@response.body)
    assert_equal response['results'].length, 1
    assert_equal response['results'][0]['id'], @webhook_template.id
  end

  test 'search webhook_template by name and organization' do
    org = Organization.first
    @webhook_template.organizations = [org]
    assert @webhook_template.save
    get :index, params: { search: @webhook_template.name, organization_id: org.id, format: 'json' }
    assert_response :success, "search webhook_template by name and organization failed with code: #{@response.code}"
    response = JSON.parse(@response.body)
    assert_equal response['results'].length, 1
    assert_equal response['results'][0]['id'], @webhook_template.id
  end

  test "should created webhook_template with unwrapped 'template'" do
    assert_difference('WebhookTemplate.unscoped.count') do
      post :create, params: valid_attrs
    end
    assert_response :created
  end

  test 'should update webhook_template' do
    put :update, params: { id: @webhook_template.to_param, webhook_template: valid_attrs }
    assert_response :success
  end

  test 'should destroy webhook_template' do
    assert_difference('WebhookTemplate.unscoped.count', -1) do
      delete :destroy, params: { id: @webhook_template.to_param }
    end
    assert_response :success
  end

  test 'should add audit comment' do
    WebhookTemplate.auditing_enabled = true
    WebhookTemplate.any_instance.stubs(:valid?).returns(true)
    webhook_template = FactoryBot.create(:webhook_template)
    put :update, params: { id: webhook_template.to_param,
                           webhook_template: { audit_comment: 'aha', template: 'tmp' } }
    assert_response :success
    assert_equal 'aha', webhook_template.audits.last.comment
  end

  test 'should clone template' do
    original_webhook_template = FactoryBot.create(:webhook_template)
    post :clone, params: { id: original_webhook_template.to_param,
                           webhook_template: { name: 'MyClone' } }
    assert_response :success
    template = ActiveSupport::JSON.decode(@response.body)
    assert_equal(template['name'], 'MyClone')
    assert_equal(template['template'], original_webhook_template.template)
    refute_equal(template['id'], original_webhook_template.id)
  end

  test 'export should export the erb of the template' do
    get :export, params: { id: webhook_template.to_param }
    assert_response :success
    assert_equal 'text/plain', response.media_type
    assert_equal webhook_template.to_erb, response.body
  end

  test 'clone name should not be blank' do
    post :clone, params: { id: FactoryBot.create(:webhook_template).to_param,
                           webhook_template: { name: '' } }
    assert_response :unprocessable_entity
  end

  test 'should import webhook template' do
    webhook_template = FactoryBot.create(:webhook_template, template: 'a')
    post :import, params: { webhook_template: { name: webhook_template.name, template: 'b' } }
    assert_response :success
    assert_equal 'b', WebhookTemplate.unscoped.find_by_name(webhook_template.name).template
  end
end
