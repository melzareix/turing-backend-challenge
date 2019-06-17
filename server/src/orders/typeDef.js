import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema.
 */

export default gql`
  type ShortOrderDetail {
    order_id: ID!
    total_amount: Float!
    created_on: String
    shipped_on: String
    status: String
  }

  type OrderItems {
    order_id: ID!
    items: [OrderItem!]!
  }

  type OrderItem {
    product_id: ID!
    attributes: String
    quantity: Int!
    unit_cost: Float!
    subtotal: Float!
  }

  type SmallOrder {
    order_id: ID!
  }

  input OrderInput {
    tax_id: ID!
    cart_id: ID!
    shipping_id: ID!
  }

  extend type Query {
    orders: [ShortOrderDetail!]!
    order(orderId: ID!): OrderItems!
    orderShortDetail(orderId: ID!): ShortOrderDetail!
  }

  extend type Mutation {
    createOrder(order: OrderInput!): SmallOrder!
  }
`;
