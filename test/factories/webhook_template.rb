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
  end
end
