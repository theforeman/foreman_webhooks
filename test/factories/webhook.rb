# frozen_string_literal: true

FactoryBot.define do
  factory :webhook do
    sequence(:name) { |n| "Webhook #{n}" }
    target_url { 'https://hook.example.com/api/callback' }
    events { ['subnet_created.event.foreman'] }
    payload_template

    trait :with_template do
      transient do
        template { 'template content' }
      end
      after(:build) do |webhook, evaluator|
        webhook.payload_template = FactoryBot.create(:payload_template, template: evaluator.template)
      end
    end
  end
end
