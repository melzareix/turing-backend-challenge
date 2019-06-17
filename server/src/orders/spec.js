import Knex from 'knex';
import faker from 'faker';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Order } from './order';
import { CustomerModel, Customers } from '../customers/customer';
import { Cart } from '../cart/cart';

/**
 * Initialize database.
 */

let customer;
let orderId;
const cartId = faker.random.alphaNumeric(6);

const customerData = {
  customer_id: faker.random.number({ min: 1000, max: 2000 }),
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.name.firstName()
};

beforeAll(async () => {
  Model.knex(Knex(knexConfig));
  // create customer
  customer = await Customers.createCustomer(customerData);

  // create cart & add items
  await Cart.addProductToCart({
    productId: '2',
    cartId,
    attributes: 'LG RED'
  });

  await Cart.addProductToCart({
    productId: 1,
    cartId,
    attributes: 'LG RED'
  });
});

test('should create a new order.', async () => {
  orderId = await Order.createOrder({
    shipping_id: 2,
    customer_id: customer.customer_id,
    cart_id: cartId,
    tax_id: 1
  });

  const orders = await Order.findAll(customer.customer_id);
  expect(orders.length).toBe(1);
});

test('should get correct order.', async () => {
  const order = await Order.findOne(orderId, customer.customer_id);

  expect(order.customer_id).toBe(customer.customer_id);
  expect(order.order_id).toBe(orderId);
});

test('should get correct order items', async () => {
  // eslint-disable-next-line camelcase
  const { order_id, items } = await Order.getOrderItems(
    orderId,
    customer.customer_id
  );
  expect(order_id).toBe(orderId);
  expect(items.length).toBe(2);
});

afterAll(async () => {
  await CustomerModel.query().deleteById(customerData.customer_id);
});

test('should not get order items if not for same user', async () => {
  // eslint-disable-next-line camelcase
  const { order_id, items } = await Order.getOrderItems(orderId, 1);
  expect(order_id).toBe(orderId);
  expect(items.length).toBe(0);
});

afterAll(async () => {
  await CustomerModel.query().deleteById(customerData.customer_id);
});
