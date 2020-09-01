# frozen_string_literal: true

FactoryBot.define do
  factory :payload_template do
    sequence(:name) { |n| "payload_template#{n}" }
    sequence(:template) { |n| "template content #{n}" }
  end
end
