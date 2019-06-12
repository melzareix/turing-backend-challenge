import { gql } from 'apollo-server-express';

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
