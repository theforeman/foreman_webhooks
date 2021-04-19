# frozen_string_literal: true

module ForemanWebhooks
  module TaxonomyExtensions
    extend ActiveSupport::Concern

    included do
      has_many :webhook_templates, -> { where(type: 'WebhookTemplate') }, through: :taxable_taxonomies, source: :taxable, source_type: 'WebhookTemplate'
    end
  end
end
