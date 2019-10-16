# frozen_string_literal: true

FactoryBot.define do
  factory :webhook_target do
    sequence(:name) { |n| "Webhook Target #{n}" }
    target_url { 'https://hook.example.com/api/callback' }
    events { ['subnet_created'] }
  end
end
