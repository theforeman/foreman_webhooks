# frozen_string_literal: true

Rails.application.routes.draw do
  resources :webhook_targets, except: :show

  namespace :api, defaults: { format: 'json' } do
    scope '(:apiv)', module: :v2, defaults: { apiv: 'v2' }, apiv: /v1|v2/, constraints: ApiConstraints.new(version: 2, default: true) do
      resources :webhook_targets, only: %i[index show create update destroy]
    end
  end
end
