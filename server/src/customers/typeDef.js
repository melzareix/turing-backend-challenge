import { gql } from 'apollo-server-express';

export default gql`
  type Customer {
    customer_id: ID!
    name: String!
    email: String!
    address_1: String
    address_2: String
    city: String
    region: String
    postal_code: String
    country: String
    shipping_region_id: Int
    day_phone: String
    eve_phone: String
    mob_phone: String
    credit_card: String
  }

  type LoginToken {
    customer: Customer!
    accessToken: String!
    expires_in: String!
  }

  input CustomerDataInput {
    name: String!
    email: String!
    password: String
    day_phone: String
    eve_phone: String
    mob_phone: String
  }

  input CustomerAddressDataInput {
    address_1: String!
    address_2: String
    city: String!
    region: String!
    postal_code: String!
    country: String!
    shipping_region_id: Int!
  }

  extend type Query {
    customer: Customer
  }

  type Mutation {
    loginCustomer(email: String!, password: String!): LoginToken!
    facebookLoginCustomer(accessToken: String!): LoginToken!
    signupCustomer(
      name: String!
      email: String!
      password: String!
    ): LoginToken!

    updateCustomer(customerData: CustomerDataInput!): Customer!
    updateCustomerAddress(addressData: CustomerAddressDataInput!): Customer!
    updateCustomerCreditCard(creditCard: String!): Customer!
  }
`;
