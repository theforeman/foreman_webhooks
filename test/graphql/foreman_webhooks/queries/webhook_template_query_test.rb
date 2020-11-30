# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  module Queries
    class WebhookTemplateQueryTest < GraphQLQueryTestCase
      let(:query) do
        <<-GRAPHQL
        query (
          $id: String!
        ) {
          webhookTemplate(id: $id) {
            id
            createdAt
            updatedAt
            name
            template
            vendor
            type
            osFamily
            description
            snippet
            locked
            default
            webhooks {
              totalCount
              edges {
                node {
                  id
                }
              }
            }
          }
        }
        GRAPHQL
      end

      let(:webhook_template) { FactoryBot.create(:webhook_template, :with_webhooks) }
      let(:global_id) { Foreman::GlobalId.for(webhook_template) }
      let(:variables) { { id: global_id } }
      let(:data) { result['data']['webhookTemplate'] }

      test 'fetching webhook template attributes' do
        assert_empty result['errors']

        assert_equal global_id, data['id']
        assert_equal webhook_template.created_at.utc.iso8601, data['createdAt']
        assert_equal webhook_template.updated_at.utc.iso8601, data['updatedAt']
        assert_equal webhook_template.name, data['name']
        assert_equal webhook_template.template, data['template']
        assert_equal webhook_template.vendor, data['vendor']
        assert_equal webhook_template.type, data['type']
        assert_equal webhook_template.os_family, data['osFamily']
        assert_equal webhook_template.description, data['description']
        assert_equal webhook_template.snippet, data['snippet']
        assert_equal webhook_template.locked, data['locked']
        assert_equal webhook_template.default, data['default']

        assert_collection webhook_template.webhooks, data['webhooks']
      end
    end
  end
end
