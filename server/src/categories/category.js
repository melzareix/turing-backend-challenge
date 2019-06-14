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
