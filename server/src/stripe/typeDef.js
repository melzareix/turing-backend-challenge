import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema.
 */
export default gql`
  type StripeObject {
    id: String!
    object: String!
    amount: Float!
  }

  enum Currency {
    USD
    EUR
  }

  input StripeOrder {
    stripeToken: String!
    order_id: Int!
    description: String!
    amount: Int!
    currency: Currency! = USD
  }
  extend type Mutation {
    stripeCharge(order: StripeOrder!): StripeObject!
  }
`;
