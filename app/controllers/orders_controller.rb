# frozen_string_literal: true

class OrdersController < AuthenticatedController
  def index
    @orders = ShopifyAPI::Order.find(:all)

    render json: { orders: @orders.to_a.map(&:serializable_hash) }
  end
end
