# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  module Queries
    class WebhookTemplatesQueryTest < GraphQLQueryTestCase
      let(:query) do
        <<-GRAPHQL
        query {
          webhookTemplates {
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

      let(:data) { result['data']['webhookTemplates'] }

      setup do
        FactoryBot.create(:webhook_template)
      end

      test 'fetching webhook templates attributes' do
        assert_empty result['errors']

        expected_count = ::WebhookTemplate.count

        assert_not_equal 0, expected_count
        assert_equal expected_count, data['totalCount']
        assert_equal expected_count, data['edges'].count
      end
    end
  end
end
