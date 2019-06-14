import { Model } from 'objection';

export class DepartmentModel extends Model {
  static get tableName() {
    return 'department';
  }

  static get idColumn() {
    return 'department_id';
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
