# frozen_string_literal: true

FactoryBot.define do
  factory :webhook_template do
    sequence(:name) { |n| "webhook_template#{n}" }
    sequence(:template) { |n| "template content #{n}" }

    trait :snippet do
      snippet { true }
    end

    trait :locked do
      locked { true }
    end

    trait :with_webhooks do
      transient do
        webhooks_count { 2 }
      end

      after(:create) do |webhook_template, evaluator|
        create_list(:webhook, evaluator.webhooks_count, webhook_template: webhook_template)
      end
    end
  end
end
