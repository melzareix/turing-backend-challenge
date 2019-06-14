import { gql } from 'apollo-server-express';

export default gql`
  type Tax {
    tax_id: ID!
    tax_type: String!
    tax_percentage: String!
  }

  extend type Query {
    taxes: [Tax!]!
    getTax(id: ID!): Tax
  }
`;
