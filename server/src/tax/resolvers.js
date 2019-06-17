import { Tax } from './tax';

/**
 * GraphQL Resolver functions.
 */
const resolvers = {
  Query: {
    taxes: async () => {
      return Tax.findAll();
    },
    getTax: async (parent, { id }) => {
      return Tax.findOne(id);
    }
  }
};

export default resolvers;
