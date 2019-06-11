import orm from '../utils/db';

export const DepartmentModel = orm.Model.extend({
  tableName: 'department',
  idAttribute: 'department_id'
});

export class Departments {
  /*
   * Return all departments.
   */
  static async findAll() {
    const results = await DepartmentModel.fetchAll();
    return results.serialize();
  }

  /**
   * Return paginated departments.
   */
  static async findPage(page = 1) {
    const results = await DepartmentModel.fetchPage({ page });
    return results.serialize();
  }

  /**
   * Return department with id.
   */
  static async findOne(id) {
    const result = await DepartmentModel.query(
      'where',
      'department_id',
      '=',
      id
    ).fetch();
    if (result != null) {
      return result.serialize();
    }
    return result;
  }
}
