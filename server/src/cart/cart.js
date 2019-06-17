import { Model } from 'objection';
import { ProductModel } from '../products/product';

/**
 * ORM Model for DB Shopping Cart Table.
 */
/* istanbul ignore next */
export class CartModel extends Model {
  static get tableName() {
    return 'shopping_cart';
  }

  static get idColumn() {
    return 'item_id';
  }

  static get relationMappings() {
    return {
      // get products in the cart
      products: {
        relation: Model.HasManyRelation,
        modelClass: ProductModel,
        join: {
          from: 'shopping_cart.product_id',
          to: 'product.product_id'
        }
      }
    };
  }
}

/**
 * Cart Repository.
 */
export class Cart {
  /**
   * Get all items in a cart.
   */
  static async cartItems(cartId) {
    const items = await CartModel.query()
      .where({
        cart_id: cartId
      })
      .joinRelation('products')
      .select('*');
    return items.map(item => {
      item.subtotal = item.price * item.quantity;
      return item;
    });
  }

  /**
   * Add a product to a specific cart.
   * @param cartId
   * @param productId
   * @param attributes
   * @returns {Promise<Array|*>}
   */
  static async addProductToCart({ cartId, productId, attributes }) {
    await Model.knex().raw('call shopping_cart_add_product(?, ?, ?)', [
      cartId,
      productId,
      attributes
    ]);
    return Cart.cartItems(cartId);
  }

  /**
   * Update cart item to a new quantity.
   * @param itemId
   * @param quantity
   * @returns {Promise<Array|*>}
   */
  static async updateCartItem({ itemId, quantity }) {
    await Model.knex().raw('call shopping_cart_update(?, ?)', [
      itemId,
      quantity
    ]);
    const cart = await CartModel.query().findById(itemId);
    return Cart.cartItems(cart.cart_id);
  }

  /**
   * Remove all products from a specific cart.
   * @param cartId
   * @returns {Promise<Array>}
   */
  static async emptyCart(cartId) {
    await CartModel.query()
      .delete()
      .where({
        cart_id: cartId
      });
    return [];
  }

  /**
   * Save item in the cart for later.
   */
  static async saveItemForLater(itemId) {
    await CartModel.query().patchAndFetchById(itemId, {
      buy_now: 0
    });
    const cart = await CartModel.query().findById(itemId);
    /* istanbul ignore if */
    if (!cart) return [];
    return this.getSavedItems(cart.cart_id);
  }

  /**
   * Get saved items in the cart.
   */
  static async getSavedItems(cartId) {
    const cart = await this.cartItems(cartId);
    return cart.filter(e => !e.buy_now);
  }

  /**
   * Delete item from the cart.
   */
  static async deleteItem(itemId) {
    const cart = await CartModel.query().findById(itemId);
    if (!cart) return [];
    await CartModel.query().deleteById(itemId);
    return this.cartItems(cart.cart_id);
  }

  /**
   * Get total amount of the products in the cart.
   */
  static async totalCartAmount(cartId) {
    const cart = await this.cartItems(cartId);
    return cart.reduce((acc, elm) => {
      return acc + elm.subtotal;
    }, 0);
  }
}
