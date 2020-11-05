# frozen_string_literal: true

require File.expand_path('lib/foreman_webhooks/version', __dir__)

Gem::Specification.new do |s|
  s.name        = 'foreman_webhooks'
  s.version     = ForemanWebhooks::VERSION
  s.license     = 'GPL-3.0'
  s.authors     = ['Timo Goebel']
  s.email       = ['mail@timogoebel.name']
  s.homepage    = 'https://github.com/timogoebel/foreman_webhooks'
  s.summary     = 'Configure webhooks for Foreman.'
  s.description = 'Plugin for Foreman that allows to configure Webhooks.'

  s.files = Dir['{app,config,db,lib,webpack}/**/*'] + ['LICENSE', 'Rakefile', 'README.md', 'package.json']
  s.test_files = Dir['test/**/*'] + Dir['webpack/**/__tests__/*.js']

  s.add_development_dependency 'rdoc'
  s.add_development_dependency 'rubocop', '~> 0.71.0'
end
