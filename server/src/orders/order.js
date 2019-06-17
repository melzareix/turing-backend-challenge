import { Model } from 'objection';

/**
 * ORM Model for DB Orders Table.
 */

/* istanbul ignore next */
export class OrderModel extends Model {
  static get tableName() {
    return 'orders';
  }

  static get idColumn() {
    return 'order_id';
  }
}

/**
 * ORM Model for DB Order Detail Table.
 */

/* istanbul ignore next */
export class OrderDetailModel extends Model {
  static get tableName() {
    return 'order_detail';
  }

  static get idColumn() {
    return 'item_id';
  }
}

/**
 * Orders Repository.
 */

export class Order {
  /**
   * Get All Orders by a customer.
   */
  static async findAll(customerId) {
    return OrderModel.query().where({
      customer_id: customerId
    });
  }

  /**
   * Get Specific Order by a customer.
   */
  static async findOne(orderId, customerId) {
    return OrderModel.query().findOne({
      order_id: orderId,
      customer_id: customerId
    });
  }

  /**
   * Create a new order.
   */
  // eslint-disable-next-line camelcase
  static async createOrder({ customer_id, tax_id, shipping_id, cart_id }) {
    // eslint-disable-next-line camelcase
    const bindings = [cart_id, customer_id, shipping_id, tax_id];
    const order = await Model.knex().raw(
      'call shopping_cart_create_order(?, ?, ?, ?)',
      bindings
    );
    return order[0][0][0].orderId;
  }

  /**
   * Get details about items in the order.
   */
  static async getOrderItems(orderId, customerId) {
    const order = await this.findOne(orderId, customerId);
    let orderItems = [];
    const result = {
      order_id: orderId,
      items: []
    };
    if (order) {
      orderItems = await OrderDetailModel.query().where({
        order_id: orderId
      });
      orderItems = orderItems.map(item => {
        item.subtotal = item.quantity * item.unit_cost;
        return item;
      });
      result.items = orderItems;
    }

    return result;
  }
}
