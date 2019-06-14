import { Model } from 'objection';
import { ProductModel } from '../products/product';

export class CartModel extends Model {
  static get tableName() {
    return 'shopping_cart';
  }

  static get idColumn() {
    return 'item_id';
  }

  static get relationMappings() {
    return {
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

export class Cart {
  static async cartItems(cartId) {
    const items = await CartModel.query()
      .where({
        cart_id: cartId
      })
      .joinRelation('products')
      .select('*');
    if (!items) return [];
    return items.map(item => {
      item.subtotal = item.price * item.quantity;
      return item;
    });
  }

  static async addProductToCart({ cartId, productId, attributes }) {
    await Model.knex().raw('call shopping_cart_add_product(?, ?, ?)', [
      cartId,
      productId,
      attributes
    ]);
    return Cart.cartItems(cartId);
  }

  static async updateCartItem({ itemId, quantity }) {
    await Model.knex().raw('call shopping_cart_update(?, ?)', [
      itemId,
      quantity
    ]);
    const cart = await CartModel.query().findById(itemId);
    return Cart.cartItems(cart.cart_id);
  }

  static async emptyCart(cartId) {
    await CartModel.query()
      .delete()
      .where({
        cart_id: cartId
      });
    return [];
  }

  static async saveItemForLater(itemId) {
    await CartModel.query().patchAndFetchById(itemId, {
      buy_now: 0
    });
    const cart = await CartModel.query().findById(itemId);
    if (!cart) return [];
    return this.getSavedItems(cart.cart_id);
  }

  static async getSavedItems(cartId) {
    const cart = await this.cartItems(cartId);
    return cart.filter(e => !e.buy_now);
  }

  static async deleteItem(itemId) {
    const cart = await CartModel.query().findById(itemId);
    if (!cart) return [];
    await CartModel.query().deleteById(itemId);
    return this.cartItems(cart.cart_id);
  }

  static async totalCartAmount(cartId) {
    const cart = await this.cartItems(cartId);
    if (!cart) return 0;
    return cart.reduce((acc, elm) => {
      return acc + elm.subtotal;
    }, 0);
  }
}
