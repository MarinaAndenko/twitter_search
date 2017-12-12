Rails.application.routes.draw do
  root to: 'tweets#index'
  get :search, to: 'tweets#index'
end
