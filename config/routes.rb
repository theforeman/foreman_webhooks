# frozen_string_literal: true

Rails.application.routes.draw do
  resources :webhooks, except: %i[index show new edit update] do
    collection do
      get 'auto_complete_search'
    end
  end
  match '/webhooks' => 'react#index', via: :get

  namespace :api, defaults: { format: 'json' } do
    scope '(:apiv)',
          module: :v2,
          defaults: { apiv: 'v2' },
          apiv: /v1|v2/,
          constraints: ApiConstraints.new(version: 2, default: true) do
      resources :webhooks, only: %i[index show create update destroy] do
        collection do
          get :events
        end
      end
      resources :webhook_templates, except: %i[new edit] do
        member do
          post :clone
          get :export
        end
        collection do
          post :import
        end
      end
    end
  end

  scope 'templates' do
    resources :webhook_templates, except: :show do
      member do
        get 'clone_template'
        get 'lock'
        get 'unlock'
        get 'export'
        post 'preview'
      end
      collection do
        post 'preview'
        get 'auto_complete_search'
      end
    end
  end
end
