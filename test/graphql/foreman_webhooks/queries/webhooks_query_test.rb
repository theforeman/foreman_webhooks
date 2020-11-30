# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  module Queries
    class WebhooksQueryTest < GraphQLQueryTestCase
      let(:query) do
        <<-GRAPHQL
        query {
          webhooks {
            totalCount
            pageInfo {
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }
            edges {
              cursor
              node {
                id
              }
            }
          }
        }
        GRAPHQL
      end

      let(:data) { result['data']['webhooks'] }

      setup do
        FactoryBot.create(:webhook)
      end

      test 'fetching webhooks attributes' do
        assert_empty result['errors']

        expected_count = ::Webhook.count

        assert_not_equal 0, expected_count
        assert_equal expected_count, data['totalCount']
        assert_equal expected_count, data['edges'].count
      end
    end
  end
end
