import { gql } from 'apollo-server-express';

export default gql`
  type ShippingRegion {
    shipping_region_id: ID!
    shipping_region: String!
  }

  type ShippingRegionType {
    shipping_id: ID!
    shipping_type: String!
    shipping_cost: String!
    shipping_region_id: ID!
  }

  extend type Query {
    shippingRegions: [ShippingRegion!]!
    shippingRegionTypes(shippingRegionId: ID!): [ShippingRegionType!]!
  }
`;
