import crypto from 'crypto';
import { Cart } from './cart';

const resolvers = {
  Query: {
    cart: async (_, { cartId }) => {
      return Cart.cartItems(cartId);
    },
    totalCartAmount: async (_, { cartId }) => {
      return Cart.totalCartAmount(cartId);
    },
    cartSavedItems: async (_, { cartId }) => {
      return Cart.getSavedItems(cartId);
    }
  },
  Mutation: {
    generateCartId: () => {
      return crypto.randomBytes(10).toString('hex');
    },
    addProductToCart: async (_, { cartId, productId, attributes }) => {
      return Cart.addProductToCart({ cartId, productId, attributes });
    },
    updateCartItem: async (_, { itemId, quantity }) => {
      return Cart.updateCartItem({ itemId, quantity });
    },
    emptyCart: async (_, { cartId }) => {
      return Cart.emptyCart(cartId);
    },
    saveItemForLater: async (_, { itemId }) => {
      return Cart.saveItemForLater(itemId);
    },
    removeItemFromCart: async (_, { itemId }) => {
      return Cart.deleteItem(itemId);
    }
  }
};

export default resolvers;
