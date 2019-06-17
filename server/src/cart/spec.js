import Knex from 'knex';
import crypto from 'crypto';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Cart } from './cart';

let cartItems;
let cartId;

/**
 * Initialize database.
 */

beforeAll(() => {
  Model.knex(Knex(knexConfig));
  cartId = crypto.randomBytes(10).toString('hex');
});

test('should return zero length array for wrong cart id.', async () => {
  const cart = await Cart.cartItems('bad_cart_id');
  expect(cart.length).toBe(0);
});

test('should return zero length array for empty cart.', async () => {
  const cart = await Cart.cartItems(cartId);
  expect(cart.length).toBe(0);
});

test('should add product to cart.', async () => {
  cartItems = await Cart.addProductToCart({
    cartId,
    productId: 1,
    attributes: 'LG RED'
  });
  expect(cartItems.length).toBe(1);
});

test('should update cart product quantity.', async () => {
  const QUANTITY = 5;
  const cart = await Cart.updateCartItem({
    itemId: cartItems[0].item_id,
    quantity: QUANTITY
  });
  expect(cart[0].quantity).toBe(QUANTITY);
});

test('should save item for later.', async () => {
  const savedItems = await Cart.saveItemForLater(cartItems[0].item_id);
  expect(savedItems.length).toBe(1);
});


test('should delete item from cart.', async () => {
  cartItems = await Cart.deleteItem(cartItems[0].item_id);
  expect(cartItems.length).toBe(0);
});

test('should not delete item from wrong cart id.', async () => {
  const cart = await Cart.deleteItem(23842742834);
  expect(cart.length).toBe(0);
});

test('should return correct total amount.', async () => {
  await Cart.addProductToCart({
    cartId,
    productId: 1,
    attributes: 'LG RED'
  });

  await Cart.addProductToCart({
    cartId,
    productId: 2,
    attributes: 'LG RED'
  });

  const totalAmount = await Cart.totalCartAmount(cartId);
  expect(Math.ceil(totalAmount)).toBe(32);
});

test('should empty cart from all items.', async () => {
  await Cart.emptyCart(cartId);
  cartItems = await Cart.cartItems(cartId);
  expect(cartItems.length).toBe(0);
});
