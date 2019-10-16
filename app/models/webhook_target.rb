# frozen_string_literal: true

class WebhookTarget < ApplicationRecord
  include Authorizable

  attribute :events, :string, array: true, default: []

  validates_lengths_from_database
  validates :name, :target_url, :events, presence: true
  validates :target_url, format: URI.regexp(%w[http https])

  def self.available_events
    %w[subnet_created subnet_changed subnet_deleted]
  end

  scope :for_event, ->(events) { where('events @> ARRAY[?]::varchar[]', Array(events)) }

  def events=(events)
    events = Array(events).map { |event| event.to_s.underscore }
    super(self.class.available_events & events)
  end
end
