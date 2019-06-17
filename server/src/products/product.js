import { Model } from 'objection';
import { CategoryModel } from '../categories/category';
import { CustomerModel } from '../customers/customer';

/**
 * ORM Model for DB Products Table.
 */

/* istanbul ignore next */
export class ProductModel extends Model {
  static get tableName() {
    return 'product';
  }

  static get idColumn() {
    return 'product_id';
  }

  static get relationMappings() {
    return {
      // get categories of the product
      categories: {
        relation: Model.ManyToManyRelation,
        modelClass: CategoryModel,
        join: {
          from: 'product.product_id',
          through: {
            from: 'product_category.product_id',
            to: 'product_category.category_id'
          },
          to: 'category.category_id'
        }
      }
    };
  }
}

/**
 * ORM Model for DB Review Table.
 */

/* istanbul ignore next */
export class ReviewModel extends Model {
  static get tableName() {
    return 'review';
  }

  static get idColumn() {
    return 'review_id';
  }

  static get relationMappings() {
    return {
      // get customer that posted the review
      customer: {
        relation: Model.HasOneRelation,
        modelClass: CustomerModel,
        join: { from: 'review.customer_id', to: 'customer.customer_id' }
      }
    };
  }
}

/**
 * Products Repository.
 */

export class Products {
  /**
   * Helper method to truncate description.
   */
  static truncate(products, limit) {
    return products.results.map(row => {
      if (row.description.length > limit) {
        row.description = `${row.description.substring(0, limit)}...`;
      }
      return row;
    });
  }

  /**
   * Return all products.
   */
  static async findAll(page = 1, limit = 20) {
    return ProductModel.query().page(page - 1, limit);
  }

  /**
   * Return product with id.
   */
  static async findOne(id) {
    return ProductModel.query().findById(id);
  }

  /**
   * Search for products.
   * @param query keyword(s) to search with.
   * @param allWords
   * @param page
   * @param limit
   * @param descriptionLimit
   * @returns {Promise<{count: *, products: *}>}
   */

  static async searchProducts(
    query,
    allWords = true,
    page = 1,
    limit = 20,
    descriptionLimit = 200
  ) {
    const counts = await Model.knex().raw(
      'call catalog_count_search_result(?, ?)',
      [query, allWords ? 'on' : 'off']
    );

    const results = await Model.knex().raw(
      'call catalog_search(?, ?, ?, ?, ?)',
      [query, allWords ? 'on' : 'off', descriptionLimit, limit, page - 1]
    );
    return {
      count: counts[0][0][0]['count(*)'],
      products: results[0][0]
    };
  }

  /**
   * Get all product departments and categories.
   * @param productId
   */

  static async getProductLocation(productId) {
    const locations = await Model.knex().raw(
      'call catalog_get_product_locations(?)',
      [productId]
    );
    return locations[0][0];
  }

  /**
   * Get all products in a specific category.
   */

  static async getProductsInCategory(categoryId, pagination) {
    const category = await CategoryModel.query().findById(categoryId);
    if (!category)
      return {
        count: 0,
        products: []
      };
    const results = await category
      .$relatedQuery('products')
      .page(pagination.page, pagination.limit);
    return {
      count: results.total,
      products: Products.truncate(results, pagination.description_length)
    };
  }

  /**
   * Get all products in a specific department.
   */

  static async getProductsInDepartment(depId, pagination) {
    const results = await CategoryModel.query()
      .where({
        department_id: depId
      })
      .joinRelation('products')
      .select('products.*')
      .page(pagination.page, pagination.limit);

    return {
      count: results.total,
      products: Products.truncate(results, pagination.description_length)
    };
  }

  /**
   * Get all reviews for a specific product.
   */

  static async getProductReviews(productId) {
    return ReviewModel.query()
      .where({
        product_id: productId
      })
      .innerJoinRelation('customer')
      .select('*');
  }

  /**
   * Add a review to a product.
   */

  static async addReview({ customerId, productId, review, rating }) {
    return ReviewModel.query().insert({
      customer_id: customerId,
      product_id: productId,
      review,
      rating,
      created_on: new Date()
    });
  }
}
