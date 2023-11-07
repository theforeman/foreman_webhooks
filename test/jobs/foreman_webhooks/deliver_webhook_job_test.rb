# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanWebhooks
  class DeliverWebhookJobTest < ActiveJob::TestCase
    let(:webhook) { FactoryBot.create(:webhook) }
    let(:job) do
      ::ForemanWebhooks::DeliverWebhookJob.new(event_name: 'subnet_created', payload: { id: 2 }, webhook_id: webhook.id)
    end

    it 'executes the webhook service' do
      result = { status: :success }
      ::ForemanWebhooks::WebhookService.any_instance.expects(:execute).once.returns(result)
      job.perform_now
    end
  end
end
