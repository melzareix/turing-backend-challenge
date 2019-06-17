import { Model } from 'objection';
import { ProductModel } from '../products/product';
import { DepartmentModel } from '../departments/department';

/**
 * ORM Model for DB Category Table.
 */

/* istanbul ignore next */
export class CategoryModel extends Model {
  static get tableName() {
    return 'category';
  }

  static get idColumn() {
    return 'category_id';
  }

  static get relationMappings() {
    return {
      // get all products in a category
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: ProductModel,
        join: {
          from: 'category.category_id',
          through: {
            from: 'product_category.category_id',
            to: 'product_category.product_id'
          },
          to: 'product.product_id'
        }
      },
      // get the department of the category
      department: {
        relation: Model.HasOneRelation,
        modelClass: DepartmentModel,
        join: {
          from: 'category.department_id',
          to: 'department.department_id'
        }
      }
    };
  }
}

export class Category {
  /**
   * Get All Categories.
   */
  static async findAll({ page, limit, order }) {
    return CategoryModel.query()
      .page(page - 1, limit)
      .orderBy(order);
  }

  /**
   * Get Specific category.
   */
  static async findOne(id) {
    return CategoryModel.query().findById(id);
  }

  /**
   * Get all categories for a specific product.
   */
  static async getProductCategories(id) {
    const product = await ProductModel.query().findById(id);
    if (!product) return [];
    return product.$relatedQuery('categories');
  }

  /**
   * Get all categories for a specific department.
   */
  static async getDepartmentCategories(id) {
    const department = await DepartmentModel.query().findById(id);
    if (!department) return [];
    return department.$relatedQuery('categories');
  }
}
