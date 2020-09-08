# frozen_string_literal: true

object @payload_template

extends "api/v2/payload_templates/main"

attributes :template, :default, :snippet, :locked

node do |payload_template|
  partial("api/v2/taxonomies/children_nodes", object: payload_template)
end
