import { gql } from 'apollo-server-express';

export default gql`
  type CartItem {
    item_id: ID!
    name: String!
    attributes: String!
    product_id: ID!
    price: Float!
    quantity: Int!
    image: String
    subtotal: String!
  }

  type SimpleCartItem {
    item_id: ID!
    name: String!
    attributes: String!
    price: Float!
  }

  extend type Query {
    cart(cartId: String): [CartItem!]!
    totalCartAmount(cartId: String): Float
    cartSavedItems(cartId: String): [CartItem!]!
  }

  extend type Mutation {
    generateCartId: String!
    addProductToCart(
      cartId: String!
      productId: ID!
      attributes: String!
    ): [CartItem!]!
    updateCartItem(itemId: ID!, quantity: Int!): [CartItem!]!
    emptyCart(cartId: ID!): [CartItem!]!
    saveItemForLater(itemId: ID!): [CartItem!]!
    removeItemFromCart(itemId: ID!): [CartItem!]!
  }
`;
