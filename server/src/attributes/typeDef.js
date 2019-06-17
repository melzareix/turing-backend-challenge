import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema for Attributes.
 */
export default gql`
  type Attribute {
    attribute_id: Int!
    name: String!
  }

  type AttributeValue {
    attribute_value_id: Int!
    value: String!
  }

  type ProductAttribute {
    attribute_name: String!
    attribute_value: String!
    attribute_value_id: Int!
  }

  extend type Query {
    attributes: [Attribute!]!
    attribute(id: String!): Attribute
    attributeValues(id: String!): [AttributeValue!]!
    productAttributes(id: String!): [ProductAttribute!]!
  }
`;
