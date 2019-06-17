import { Departments } from './department';

/**
 * GraphQL Resolver functions.
 */
const resolvers = {
  Query: {
    departments: async () => {
      return Departments.findAll();
    },
    department: (_, args) => {
      return Departments.findOne(args.id);
    }
  }
};

export default resolvers;
