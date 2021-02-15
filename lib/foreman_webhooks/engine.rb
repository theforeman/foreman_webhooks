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
        requires_foreman '>= 2.5'

        apipie_documented_controllers ["#{ForemanWebhooks::Engine.root}/app/controllers/api/v2/*.rb"]
        ApipieDSL.configuration.sections += ['webhooks']
        ApipieDSL.configuration.dsl_classes_matchers += [
          "#{ForemanWebhooks::Engine.root}/app/lib/foreman_webhooks/renderer/**/*.rb"
        ]

        register_global_js_file 'routes'

        # Add permissions
        security_block :foreman_webhooks do
          permission :view_webhooks,    { webhooks: %i[index show auto_complete_search],
                                          'api/v2/webhooks': %i[index show events] }, resource_type: 'Webhook'
          permission :create_webhooks,  { webhooks: %i[new create],
                                          'api/v2/webhooks': [:create] }, resource_type: 'Webhook'
          permission :edit_webhooks,    { webhooks: %i[edit update],
                                          'api/v2/webhooks': [:update] }, resource_type: 'Webhook'
          permission :destroy_webhooks, { webhooks: [:destroy],
                                          'api/v2/webhooks': [:destroy] }, resource_type: 'Webhook'
          permission :view_webhook_templates, { webhook_templates: %i[index show auto_complete_search preview export],
                                                'api/v2/webhook_templates': %i[index show export] },
                     resource_type: 'WebhookTemplate'
          permission :create_webhook_templates,   { webhook_templates: %i[new create clone_template],
                                                    'api/v2/webhook_templates': %i[create clone import] },
                     resource_type: 'WebhookTemplate'
          permission :edit_webhook_templates,     { webhook_templates: %i[edit update],
                                                    'api/v2/webhook_templates': %i[update import] },
                     resource_type: 'WebhookTemplate'
          permission :destroy_webhook_templates,  { webhook_templates: [:destroy],
                                                    'api/v2/webhook_templates': [:destroy] },
                     resource_type: 'WebhookTemplate'
          permission :lock_webhook_templates,     { webhook_templates: %i[lock unlock],
                                                    'api/v2/webhook_templates': %i[lock unlock] },
                     resource_type: 'WebhookTemplate'
        end

        role 'Webhooks Reader',
             %i[view_webhooks view_webhook_templates]

        role 'Webhooks Manager',
             %i[view_webhooks create_webhooks edit_webhooks destroy_webhooks
                view_webhook_templates create_webhook_templates
                edit_webhook_templates destroy_webhook_templates
                lock_webhook_templates]

        # add menu entry
        divider :admin_menu, caption: N_('Webhook'), parent: :administer_menu
        menu :admin_menu, :webhooks, url: '/webhooks',
                                     url_hash: { controller: :webhooks, action: :index },
                                     caption: N_('Webhooks'),
                                     parent: :administer_menu
        menu :admin_menu, :webhook_templates, url_hash: { controller: :webhook_templates, action: :index },
                                              caption: N_('Webhook Templates'),
                                              parent: :administer_menu

        # add helpers to safe-mode
        allowed_template_helpers :payload

        # subscribe to all events
        subscribe(/.event.foreman$/, ::ForemanWebhooks::EventSubscriber)
      end
    end

    # Include concerns in this config.to_prepare block
    config.to_prepare do
      (Taxonomy.descendants + [Taxonomy]).each { |klass| klass.send(:include, ForemanWebhooks::TaxonomyExtensions) }
    rescue StandardError => e
      Rails.logger.warn "ForemanWebhooks: skipping engine hook (#{e})"
    end
  end
end
