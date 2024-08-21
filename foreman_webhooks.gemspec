# frozen_string_literal: true

require File.expand_path('lib/foreman_webhooks/version', __dir__)

Gem::Specification.new do |s|
  s.name        = 'foreman_webhooks'
  s.version     = ForemanWebhooks::VERSION
  s.metadata    = { 'is_foreman_plugin' => 'true' }
  s.license     = 'GPL-3.0'
  s.authors     = ['Timo Goebel']
  s.email       = ['mail@timogoebel.name']
  s.homepage    = 'https://github.com/theforeman/foreman_webhooks'
  s.summary     = 'Configure webhooks for Foreman.'
  s.description = 'Plugin for Foreman that allows to configure Webhooks.'

  s.required_ruby_version = '>= 2.7.0'

  s.files = Dir['{app,config,db,lib,webpack}/**/*'] + ['LICENSE', 'Rakefile', 'README.md', 'package.json'] + \
            # .mo files are compiled; .po are sources; .edit.po are temporary files
            Dir['locale/*/LC_MESSAGES/*.mo'] + Dir["locale/*/#{s.name}.po"]
  s.test_files = Dir['test/**/*'] + Dir['webpack/**/__tests__/*.js']

  s.add_development_dependency 'rake'
  s.add_development_dependency 'rdoc'
  s.add_development_dependency 'theforeman-rubocop', '~> 0.1.0'
end
