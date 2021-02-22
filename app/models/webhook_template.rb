# frozen_string_literal: true

class WebhookTemplate < Template
  audited

  include Authorizable
  extend FriendlyId
  friendly_id :name
  include Parameterizable::ByIdName

  graphql_type 'ForemanWebhooks::Types::WebhookTemplate'

  class << self
    # we have to override the base_class because polymorphic associations does not detect it correctly, more details at
    # http://apidock.com/rails/ActiveRecord/Associations/ClassMethods/has_many#1010-Polymorphic-has-many-within-inherited-class-gotcha
    def base_class
      self
    end
  end
  self.table_name = 'templates'

  before_destroy EnsureNotUsedBy.new(:webhooks)
  has_many :webhooks, foreign_key: :webhook_template_id

  validates :name, uniqueness: true

  include Taxonomix
  scoped_search on: :name,    complete_value: true, default_order: true
  scoped_search on: :locked,  complete_value: { true: true, false: false }
  scoped_search on: :snippet, complete_value: { true: true, false: false }
  scoped_search on: :template
  scoped_search on: :default, only_explicit: true, complete_value: { true: true, false: false }

  # with proc support, default_scope can no longer be chained
  # include all default scoping here
  default_scope lambda {
    with_taxonomy_scope do
      order("#{Template.table_name}.name")
    end
  }

  def self.default_render_scope_class
    ForemanWebhooks::Renderer::Scope::WebhookTemplate
  end

  def taxonomy_foreign_conditions
    { webhook_template_id: id }
  end

  def self.acceptable_template_input_types
    [:user]
  end

  def self.log_render_results?
    true
  end

  def support_single_host_render?
    false
  end
end
