import { Attributes } from './attribute';

/**
 * GraphQL Resolver functions.
 */
const resolvers = {
  Query: {
    attributes: async () => {
      return Attributes.findAll();
    },
    attribute: async (parent, { id }) => {
      return Attributes.findOne(id);
    },
    attributeValues: async (parent, { id }) => {
      return Attributes.getAttributeValues(id);
    },
    productAttributes: async (parent, { id }) => {
      return Attributes.getProductAttributes(id);
    }
  }
};

export default resolvers;
