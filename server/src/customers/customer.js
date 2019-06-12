import jwt from 'jsonwebtoken';
import orm from '../utils/db';

require('dotenv').config();

/**
 * JWT Signing & Validation.
 */

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

/**
 * Customer Model.
 */

export const CustomerModel = orm.Model.extend({
  tableName: 'customer',
  idAttribute: 'customer_id',
  generateToken() {
    const name = this.get('name');
    const id = this.get('customer_id');
    const email = this.get('email');

    return JWT.sign({ name, id, email });
  }
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

  /**
   * Create new customer.
   */
  static async createCustomer(data) {
    const customer = await new CustomerModel(data).save();
    return customer;
  }

  static async loginCustomer({ email, password }) {
    const result = await new CustomerModel()
      .query({
        where: {
          email,
          password
        }
      })
      .fetch();
    if (result != null) {
      return result.serialize();
    }
    return result;
  }
}
