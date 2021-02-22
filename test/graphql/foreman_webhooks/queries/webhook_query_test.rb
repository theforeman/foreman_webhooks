# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  module Queries
    class WebhookQueryTest < GraphQLQueryTestCase
      let(:query) do
        <<-GRAPHQL
        query (
          $id: String!
        ) {
          webhook(id: $id) {
            id
            createdAt
            updatedAt
            name
            targetUrl
            events
            httpMethod
            httpContentType
            enabled
            verifySsl
            enabled
            sslCaCerts
            user
            webhookTemplate {
              id
            }
          }
        }
        GRAPHQL
      end

      let(:webhook) { FactoryBot.create(:webhook) }
      let(:global_id) { Foreman::GlobalId.for(webhook) }
      let(:variables) { { id: global_id } }
      let(:data) { result['data']['webhook'] }

      test 'fetching webhook attributes' do
        assert_empty result['errors']

        assert_equal global_id, data['id']
        assert_equal webhook.created_at.utc.iso8601, data['createdAt']
        assert_equal webhook.updated_at.utc.iso8601, data['updatedAt']
        assert_equal webhook.name, data['name']
        assert_equal webhook.target_url, data['targetUrl']
        assert_equal webhook.events, data['events']
        assert_equal webhook.http_method, data['httpMethod']
        assert_equal webhook.http_content_type, data['httpContentType']
        assert_equal webhook.enabled, data['enabled']
        assert_equal webhook.verify_ssl, data['verifySsl']
        assert_equal webhook.enabled, data['enabled']
        assert_equal webhook.ssl_ca_certs, data['sslCaCerts']
        assert_equal webhook.user, data['user']

        assert_record webhook.webhook_template, data['webhookTemplate']
      end
    end
  end
end
