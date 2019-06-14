import { Model } from 'objection';
import { CategoryModel } from '../categories/category';
import { CustomerModel } from '../customers/customer';

export class ProductModel extends Model {
  static get tableName() {
    return 'product';
  }

  static get idColumn() {
    return 'product_id';
  }
}

export class ReviewModel extends Model {
  static get tableName() {
    return 'review';
  }

  static get idColumn() {
    return 'review_id';
  }

  static get relationMappings() {
    return {
      customer: {
        relation: Model.HasOneRelation,
        modelClass: CustomerModel,
        join: {
          from: 'review.customer_id',
          to: 'customer.customer_id'
        }
      }
    };
  }
}

export class Products {
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

  static async getProductLocation(productId) {
    const locations = await Model.knex().raw(
      'call catalog_get_product_locations(?)',
      [productId]
    );
    return locations[0][0];
  }

  static async getProductsInCategory(categoryId, pagination) {
    const category = await CategoryModel.query().findById(categoryId);
    if (!category) return null;
    const results = await category
      .$relatedQuery('products')
      .page(pagination.page, pagination.limit);
    return {
      count: results.total,
      products: Products.truncate(results, pagination.description_length)
    };
  }

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

  static async getProductReviews(productId) {
    return ReviewModel.query()
      .where({
        product_id: productId
      })
      .innerJoinRelation('customer')
      .select('*');
  }

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
