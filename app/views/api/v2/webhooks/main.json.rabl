# frozen_string_literal: true

object @webhook

extends 'api/v2/webhooks/base'
extends 'api/v2/layouts/permissions'

attributes :target_url, :enabled, :created_at, :updated_at
