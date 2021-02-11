# frozen_string_literal: true

require 'rake/testtask'

# Tasks
namespace :foreman_webhooks do
  namespace :example do
    desc 'Example Task'
    task task: :environment do
      # Task goes here
    end
  end
end

# Tests
namespace :test do
  desc 'Test ForemanWebhooks'
  Rake::TestTask.new(:foreman_webhooks) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :foreman_webhooks do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_webhooks) do |task|
        task.patterns = ["#{ForemanWebhooks::Engine.root}/app/**/*.rb",
                         "#{ForemanWebhooks::Engine.root}/lib/**/*.rb",
                         "#{ForemanWebhooks::Engine.root}/test/**/*.rb"]
      end
    rescue StandardError
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_webhooks'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_webhooks']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_webhooks', 'foreman_webhooks:rubocop']
end
