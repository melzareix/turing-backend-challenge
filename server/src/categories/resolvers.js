import { Category } from './category';

/**
 * GraphQL Resolver functions.
 */

const resolvers = {
  Query: {
    categories: async (_, { pagination }) => {
      const results = await Category.findAll(pagination);
      return {
        categories: results.results,
        count: results.total
      };
    },
    category: async (_, { categoryId }) => {
      return Category.findOne(categoryId);
    },
    productCategories: async (_, { productId }) => {
      return Category.getProductCategories(productId);
    },
    departmentCategories: async (_, { depId }) => {
      return Category.getDepartmentCategories(depId);
    }
  }
};

export default resolvers;
