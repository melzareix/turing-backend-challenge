import jwt from 'jsonwebtoken';
import orm from '../utils/db';

require('dotenv').config();

export const CustomerModel = orm.Model.extend({
  tableName: 'customer',
  idAttribute: 'customer_id'
});

export class JWT {
  static sign(data) {
    const accessToken = jwt.sign(data, process.env.JWT_KEY, {
      expiresIn: '24h'
    });
    return {
      accessToken,
      expiresIn: '24h'
    };
  }

  static validate(token) {
    return jwt.verify(token, process.env.JWT_KEY);
  }
}

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

  static async createCustomer(data) {
    const customer = await new CustomerModel(data).save();
    return customer.attributes;
  }
}
