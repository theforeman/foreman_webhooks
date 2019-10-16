# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  class DeliverWebhookJobTest < ActiveJob::TestCase
    let(:webhook_target) { FactoryBot.create(:webhook_target) }
    let(:job) { ::ForemanWebhooks::DeliverWebhookJob.new(event_name: 'subnet_created', payload: { id: 2 }.to_json, webhook_target_id: webhook_target.id) }

    it 'executes the webhook service' do
      ::ForemanWebhooks::WebhookService.any_instance.expects(:execute).once
      job.perform_now
    end
  end
end
