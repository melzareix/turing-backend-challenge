import { Products } from './product';

const resolvers = {
  Query: {
    products: async (parent, { pagination }) => {
      const results = await Products.findAll(pagination.page, pagination.limit);
      return {
        count: results.total,
        products: results.results.map(row => {
          row.description = row.description.substring(
            0,
            pagination.description_length
          );
          return row;
        })
      };
    },
    product: async (_, { id }) => {
      return Products.findOne(id);
    },
    productLocations: async (_, { id }) => {
      return Products.getProductLocation(id);
    },
    searchProduct: async (_, { searchQuery }) => {
      // eslint-disable-next-line camelcase
      const { query, all_words, pagination } = searchQuery;
      // eslint-disable-next-line camelcase
      const { page, limit, description_length } = pagination;

      return Products.searchProducts(
        query,
        all_words,
        page,
        limit,
        description_length
      );
    },
    categoryProducts: async (_, { category, pagination }) => {
      return Products.getProductsInCategory(category, pagination);
    },
    departmentProducts: async (_, { department, pagination }) => {
      return Products.getProductsInDepartment(department, pagination);
    },
    productReviews: async (_, { id }) => {
      return Products.getProductReviews(id);
    }
  },
  Mutation: {
    addProductReview: async (
      _,
      { productId, review, rating },
      { req, errors }
    ) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }
      await Products.addReview({
        customerId: req.user.customer_id,
        productId,
        review,
        rating
      });
      return true;
    }
  }
};

export default resolvers;
