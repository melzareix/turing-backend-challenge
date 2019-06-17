import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema.
 */
export default gql`
  type Department {
    department_id: ID!
    name: String!
    description: String!
  }

  type Query {
    departments: [Department!]!
    department(id: ID!): Department
  }
`;
