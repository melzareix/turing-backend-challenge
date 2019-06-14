import { Model } from 'objection';
import { ProductModel } from '../products/product';
import { DepartmentModel } from '../departments/department';

export class CategoryModel extends Model {
  static get tableName() {
    return 'category';
  }

  static get idColumn() {
    return 'category_id';
  }

  static get relationMappings() {
    return {
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

  static async getProductCategories(id) {
    const product = await ProductModel.query().findById(id);
    if (!product) return [];
    return product.$relatedQuery('categories');
  }

  static async getDepartmentCategories(id) {
    const department = await DepartmentModel.query().findById(id);
    if (!department) return [];
    return department.$relatedQuery('categories');
  }
}
