import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
   * Return customer with email.
   */

  static async findOne(email) {
    const result = await CustomerModel.query({
      where: {
        email
      }
    }).fetch();
    return result;
  }

  /**
   * Return customer with email.
   */

  static async findFacebookUser(id) {
    const result = await CustomerModel.query({
      where: {
        facebook_id: id
      }
    }).fetch();
    return result;
  }

  /**
   * Return customer with id.
   */

  static async findWithId(id) {
    const result = await CustomerModel.query({
      where: {
        customer_id: id
      }
    }).fetch();
    return result;
  }

  /**
   * Create new customer.
   */

  static async createCustomer(data) {
    data.password = await bcrypt.hash(data.password, bcrypt.genSaltSync(8));
    const customer = await new CustomerModel(data).save();
    return customer;
  }

  /**
   * Login Customer using email & password.
   */
  static async loginCustomer({ email, password }) {
    const result = await this.findOne(email);
    if (
      result != null &&
      bcrypt.compareSync(password, result.attributes.password)
    ) {
      return -1;
    }
    return result;
  }

  /**
   * Update custoemr data.
   */

  static async updateCustomer(data, user) {
    let customer = await this.findWithId(user.customer_id);
    customer = await customer.save(data);
    return customer;
  }
}
