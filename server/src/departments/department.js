import { Model } from 'objection';
import { CategoryModel } from '../categories/category';

/**
 * ORM Model for DB Departments Table.
 */
/* istanbul ignore next */
export class DepartmentModel extends Model {
  static get tableName() {
    return 'department';
  }

  static get idColumn() {
    return 'department_id';
  }

  static get relationMappings() {
    return {
      // get categories in the department
      categories: {
        relation: Model.HasManyRelation,
        modelClass: CategoryModel,
        join: {
          from: 'department.department_id',
          to: 'category.department_id'
        }
      }
    };
  }
}

export class Departments {
  /*
   * Return all departments.
   */
  static async findAll() {
    return DepartmentModel.query();
  }

  /**
   * Return department with id.
   */
  static async findOne(id) {
    return DepartmentModel.query().findById(id);
  }
}
