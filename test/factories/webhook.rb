# frozen_string_literal: true

FactoryBot.define do
  factory :webhook do
    sequence(:name) { |n| "Webhook #{n}" }
    target_url { 'https://hook.example.com/api/callback' }
    events { ['subnet_created.event.foreman'] }
    enabled { true }
    webhook_template

    trait :with_template do
      transient do
        template { 'template content' }
      end
      after(:build) do |webhook, evaluator|
        webhook.webhook_template = FactoryBot.create(:webhook_template, template: evaluator.template)
      end
    end
  end
end
