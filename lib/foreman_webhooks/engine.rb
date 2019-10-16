# frozen_string_literal: true

module ForemanWebhooks
  class Engine < ::Rails::Engine
    engine_name 'foreman_webhooks'

    config.autoload_paths += Dir["#{config.root}/app/jobs"]

    # Add any db migrations
    initializer 'foreman_webhooks.load_app_instance_data' do |app|
      ForemanWebhooks::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'foreman_webhooks.register_plugin', before: :finisher_hook do |_app|
      Foreman::Plugin.register :foreman_webhooks do
        requires_foreman '>= 1.23'

        apipie_documented_controllers ["#{ForemanWebhooks::Engine.root}/app/controllers/api/v2/*.rb"]

        # Add permissions
        security_block :foreman_webhooks do
          permission :view_webhook_targets,     { webhook_targets: %i[index show],
                                                  'api/v2/webhook_targets': %i[index show] }, resource_type: 'WebhookTarget'
          permission :create_webhook_targets,   { webhook_targets: %i[new create],
                                                  'api/v2/webhook_targets': [:create] }, resource_type: 'WebhookTarget'
          permission :edit_webhook_targets,     { webhook_targets: %i[edit update],
                                                  'api/v2/webhook_targets': [:update] }, resource_type: 'WebhookTarget'
          permission :destroy_webhook_targets,  { webhook_targets: [:destroy],
                                                  'api/v2/webhook_targets': [:destroy] }, resource_type: 'WebhookTarget'
        end

        # add menu entry
        menu :admin_menu, :webhook_targets, url_hash: { controller: :webhook_targets, action: :index },
                                            caption: N_('Webhook Targets'),
                                            parent: :administer_menu
        # event observer
        register_event_observer '::ForemanWebhooks::EventObserver'
      end
    end

    # Include concerns in this config.to_prepare block
    config.to_prepare do
      begin
        # Host::Managed.send(:include, ForemanWebhooks::HostExtensions)
      rescue StandardError => e
        Rails.logger.warn "ForemanWebhooks: skipping engine hook (#{e})"
      end
    end
  end
end
