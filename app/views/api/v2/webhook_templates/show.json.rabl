# frozen_string_literal: true

object @webhook_template

extends 'api/v2/webhook_templates/main'

attributes :template, :default, :snippet, :locked

node do |webhook_template|
  partial('api/v2/taxonomies/children_nodes', object: webhook_template)
end
