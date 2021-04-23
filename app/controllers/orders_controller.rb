# frozen_string_literal: true

class OrdersController < AuthenticatedController
  def index
    @orders = ShopifyAPI::Order.find(:all, params: { limit: 10 })
    render(json: { orders: @orders })
  end
end
