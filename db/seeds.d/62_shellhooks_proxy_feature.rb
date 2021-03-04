# frozen_string_literal: true

proxy_feature = Feature.where(name: 'Shellhooks').first_or_create
raise "Unable to create proxy feature: #{format_errors proxy_feature}" if proxy_feature.nil? || proxy_feature.errors.any?
