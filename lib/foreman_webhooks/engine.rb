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
        requires_foreman '>= 2.0'

        apipie_documented_controllers ["#{ForemanWebhooks::Engine.root}/app/controllers/api/v2/*.rb"]
        ApipieDSL.configuration.sections += ['webhooks']
        ApipieDSL.configuration.dsl_classes_matchers += [
          "#{ForemanWebhooks::Engine.root}/app/lib/foreman_webhooks/scope/*.rb"
        ]

        # Add permissions
        security_block :foreman_webhooks do
          permission :view_webhooks,    { webhooks: %i[index show],
                                          'api/v2/webhooks': %i[index show] }, resource_type: 'Webhook'
          permission :create_webhooks,  { webhooks: %i[new create],
                                          'api/v2/webhooks': [:create] }, resource_type: 'Webhook'
          permission :edit_webhooks,    { webhooks: %i[edit update],
                                          'api/v2/webhooks': [:update] }, resource_type: 'Webhook'
          permission :destroy_webhooks, { webhooks: [:destroy],
                                          'api/v2/webhooks': [:destroy] }, resource_type: 'Webhook'
          permission :view_payload_templates,     { payload_templates: [:index, :show, :auto_complete_search, :preview, :export],
                                                    'api/v2/payload_templates': [:index, :show, :export] },
                                                  resource_type: 'PayloadTemplate'
          permission :create_payload_templates,   { payload_templates: [:new, :create, :clone_template],
                                                    'api/v2/payload_templates': [:create, :clone, :import] },
                                                  resource_type: 'PayloadTemplate'
          permission :edit_payload_templates,     { payload_templates: [:edit, :update],
                                                    'api/v2/payload_templates': [:update, :import] },
                                                  resource_type: 'PayloadTemplate'
          permission :destroy_payload_templates,  { payload_templates: [:destroy],
                                                    'api/v2/payload_templates': [:destroy] },
                                                  resource_type: 'PayloadTemplate'
          permission :lock_payload_templates,     { payload_templates: [:lock, :unlock],
                                                    'api/v2/payload_templates': [:lock, :unlock] },
                                                  resource_type: 'PayloadTemplate'
        end

        # add menu entry
        divider :admin_menu, caption: N_('Webhook'), parent: :administer_menu
        menu :admin_menu, :webhooks, url_hash: { controller: :webhooks, action: :index },
                                     caption: N_('Webhooks'),
                                     parent: :administer_menu
        menu :admin_menu, :payload_templates, url_hash: { controller: :payload_templates, action: :index },
                                              caption: N_('Payload Templates'),
                                              parent: :administer_menu
        subscribe(/.event.foreman$/, ::ForemanWebhooks::EventSubscriber)
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
