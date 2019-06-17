import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema.
 */
export default gql`
  enum CategoryOrder {
    category_id
    name
  }

  input CategoryPagination {
    order: CategoryOrder!
    page: Int! = 1
    limit: Int! = 20
  }

  type Category {
    category_id: Int!
    name: String!
    description: String!
  }

  type CategoryList {
    count: Int!
    categories: [Category!]!
  }

  extend type Query {
    categories(pagination: CategoryPagination!): CategoryList!
    category(categoryId: ID!): Category
    productCategories(productId: ID!): [Category!]!
    departmentCategories(depId: ID!): [Category!]!
  }
`;
