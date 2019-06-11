import orm from '../utils/db';

export const CustomerModel = orm.Model.extend({
  tableName: 'customer',
  idAttribute: 'customer_id'
});

export class Customers {
  /**
   * Return department with id.
   */
  static async findOne(email, password) {
    const result = await CustomerModel.query({
      where: {
        email,
        password
      }
    }).fetch();
    if (result != null) {
      return result.serialize();
    }
    return result;
  }
}
