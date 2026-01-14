# frozen_string_literal: true

require_relative '../test_plugin_helper'
require 'integration_test_helper'

class WebhooksIntegrationTest < IntegrationTestWithJavascript
  let(:webhook_template) { FactoryBot.create(:webhook_template, name: 'Test Template') }
  let(:second_template) { FactoryBot.create(:webhook_template, name: 'Second Template') }

  setup do
    webhook_template
    second_template
  end

  test 'create webhook and verify via UI' do
    hook_name = "TestWebhook"
    subscribe_to = 'Host Created'
    target_url = 'http://example.com/webhook'
    http_method = 'GET'
    username = 'testuser'
    password = 'testpass123'

    visit '/webhooks'
    assert_selector 'h1', text: 'Webhooks'

    click_button 'Create new'
    assert_selector '.pf-v5-c-modal-box'

    fill_in_typeahead('id-event', subscribe_to)
    fill_in 'id-name', with: hook_name
    fill_in 'id-target_url', with: target_url
    fill_in_typeahead('id-webhook_template_id', webhook_template.name)
    fill_in_typeahead('id-http_method', http_method)
    uncheck_checkbox('id-enabled')

    click_tab('Credentials')
    fill_in 'id-user', with: username
    fill_in 'id-password', with: password
    check_checkbox('id-proxy_authorization')
    uncheck_checkbox('id-verify_ssl')

    click_submit_button
    wait_for_success_toast

    visit '/webhooks'
    wait_for_ajax
    click_webhook_name(hook_name)
    assert_selector '.pf-v5-c-modal-box'

    assert_field_value('id-name', hook_name)
    assert_typeahead_value('id-event', subscribe_to)
    assert_field_value('id-target_url', target_url)
    assert_typeahead_value('id-webhook_template_id', webhook_template.name)
    assert_typeahead_value('id-http_method', http_method)
    assert_checkbox_unchecked('id-enabled')

    click_tab('Credentials')
    assert_field_value('id-user', username)
    assert_checkbox_checked('id-proxy_authorization')
    assert_checkbox_unchecked('id-verify_ssl')

    click_cancel_button
    assert_no_selector '.pf-v5-c-modal-box'

    webhook = Webhook.find_by(name: hook_name)
    assert webhook, "Webhook '#{hook_name}' was not created"
    assert webhook.password.present?, 'Password was not saved to database'
  end

  test 'update webhook and verify via UI' do
    webhook = FactoryBot.create(:webhook,
      name: 'ExistingWebhook',
      target_url: 'http://old.example.com/webhook',
      http_method: 'POST',
      webhook_template: webhook_template,
      user: 'olduser',
      password: 'oldpass123',
      enabled: false)

    new_hook_name = "UpdatedWebhook"
    new_subscribe_to = 'Host Destroyed'
    new_target_url = 'http://newexample.com/webhook'
    new_http_method = 'PUT'

    visit '/webhooks'
    wait_for_ajax
    click_webhook_name(webhook.name)
    assert_selector '.pf-v5-c-modal-box'

    fill_in_typeahead('id-event', new_subscribe_to)
    fill_in 'id-name', with: '', fill_options: { clear: :backspace }
    fill_in 'id-name', with: new_hook_name
    fill_in 'id-target_url', with: '', fill_options: { clear: :backspace }
    fill_in 'id-target_url', with: new_target_url
    fill_in_typeahead('id-webhook_template_id', second_template.name)
    fill_in_typeahead('id-http_method', new_http_method)
    check_checkbox('id-enabled')

    click_submit_button
    wait_for_success_toast

    visit '/webhooks'
    wait_for_ajax
    click_webhook_name(new_hook_name)
    assert_selector '.pf-v5-c-modal-box'

    assert_field_value('id-name', new_hook_name)
    assert_typeahead_value('id-event', new_subscribe_to)
    assert_field_value('id-target_url', new_target_url)
    assert_typeahead_value('id-webhook_template_id', second_template.name)
    assert_typeahead_value('id-http_method', new_http_method)
    assert_checkbox_checked('id-enabled')

    click_cancel_button
    assert_no_selector '.pf-v5-c-modal-box'

    webhook.reload
    assert webhook.password.present?, 'Password was cleared after update'
  end

  test 'delete webhook via UI' do
    webhook = FactoryBot.create(:webhook,
      name: 'WebhookToDelete',
      target_url: 'http://example.com/webhook',
      http_method: 'POST',
      webhook_template: webhook_template)

    visit '/webhooks'
    wait_for_ajax
    click_webhook_delete_button(webhook.name)
    assert_selector '#webhookDeleteModal'
    click_delete_confirm_button
    wait_for_success_toast
    assert_no_selector '#webhookDeleteModal'

    assert_no_selector :xpath, "//tr[contains(., '#{webhook.name}')]"
    assert_nil Webhook.find_by(name: webhook.name), "Webhook should be deleted"
  end

  private

  def click_tab(tab_name)
    tab_id = case tab_name
             when 'General' then 'webhook-form-tab-general'
             when 'Credentials' then 'webhook-form-tab-creds'
             when 'Additional' then 'webhook-form-tab-add'
             else raise "Unknown tab: #{tab_name}"
             end
    tab_button = find(:ouia_component_id, tab_id)
    page.execute_script('arguments[0].click()', tab_button.native)
  end

  def fill_in_typeahead(field_id, value)
    input = find("##{field_id}")
    input.click
    input.send_keys([:control, 'a'])
    input.send_keys(:backspace)
    input.send_keys(value)
    # Wait for dropdown to appear with matching option
    assert_selector '[role="option"]', text: value
    find('[role="option"]', text: value, match: :prefer_exact).click
    # Wait for dropdown to close
    assert_no_selector '[role="listbox"]'
  end

  def check_checkbox(field_id)
    checkbox = find("##{field_id}", visible: :all)
    return if checkbox.checked?
    page.execute_script("document.getElementById('#{field_id}').click()")
  end

  def uncheck_checkbox(field_id)
    checkbox = find("##{field_id}", visible: :all)
    return unless checkbox.checked?
    page.execute_script("document.getElementById('#{field_id}').click()")
  end

  def click_submit_button
    modal = find('.pf-v5-c-modal-box', wait: 10)
    button = modal.find(:ouia_component_id, 'submit-webhook-form', wait: 10, visible: :all)
    wait_for { !button.disabled? }
    page.execute_script('arguments[0].scrollIntoView({block: "center"})', button.native)
    page.execute_script('arguments[0].click()', button.native)
  end

  def click_cancel_button
    modal = find('.pf-v5-c-modal-box', wait: 10)
    button = modal.find('button', text: 'Cancel', match: :first, wait: 10, visible: :all)
    page.execute_script('arguments[0].scrollIntoView({block: "center"})', button.native)
    page.execute_script('arguments[0].click()', button.native)
  end

  def click_webhook_name(name)
    row = find(:xpath, "//tbody//tr[contains(., '#{name}')]", wait: 15, match: :first)
    within(row) do
      button = find(:ouia_component_id, 'name-edit-active-button', wait: 10)
      page.execute_script('arguments[0].click()', button.native)
    end
  end

  def click_webhook_delete_button(name)
    row = find(:xpath, "//tbody//tr[contains(., '#{name}')]", wait: 15, match: :first)
    within(row) do
      find('button', text: 'Delete', match: :first).click
    end
  end

  def click_delete_confirm_button
    within('#webhookDeleteModal') do
      find('button', text: 'Delete', match: :first).click
    end
  end

  def assert_field_value(field_id, expected_value)
    assert page.has_field?(field_id, with: expected_value),
      "Field #{field_id} expected '#{expected_value}'"
  end

  def assert_typeahead_value(field_id, expected_value)
    field = find("##{field_id}")
    assert_includes field.value, expected_value,
      "Typeahead #{field_id} expected to contain '#{expected_value}' but was '#{field.value}'"
  end

  def assert_checkbox_checked(field_id)
    assert page.has_checked_field?(field_id, visible: :all),
      "Checkbox #{field_id} expected to be checked"
  end

  def assert_checkbox_unchecked(field_id)
    assert page.has_unchecked_field?(field_id, visible: :all),
      "Checkbox #{field_id} expected to be unchecked"
  end
end
