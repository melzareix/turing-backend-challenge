import { gql } from 'apollo-server-express';

export default gql`
  type Product {
    product_id: ID!
    name: String!
    description: String!
    price: String!
    discounted_price: String!
    thumbnail: String!
    display: Int!
    image: String!
    image_2: String!
  }

  type ProductList {
    count: Int!
    products: [Product!]!
  }

  type Review {
    name: String!
    review: String!
    rating: Int!
    created_on: String!
  }

  input ProductPagination {
    page: Int!
    limit: Int!
    description_length: Int!
  }

  input SearchQuery {
    query: String!
    all_words: Boolean!
    pagination: ProductPagination!
  }

  type ProductLocation {
    category_id: ID!
    category_name: String!
    department_id: ID!
    department_name: String!
  }

  extend type Query {
    products(pagination: ProductPagination): ProductList!
    product(id: ID!): Product
    productLocations(id: ID): [ProductLocation!]!
    searchProduct(searchQuery: SearchQuery!): ProductList!
    categoryProducts(category: ID!, pagination: ProductPagination): ProductList!
    departmentProducts(
      department: ID!
      pagination: ProductPagination
    ): ProductList!
    productReviews(id: ID!): [Review!]!
  }

  extend type Mutation {
    addProductReview(productId: ID!, review: String!, rating: Int!): Boolean
  }
`;
