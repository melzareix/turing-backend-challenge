import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Model } from 'objection';

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

export class CustomerModel extends Model {
  static get tableName() {
    return 'customer';
  }

  static get idColumn() {
    return 'customer_id';
  }

  generateToken() {
    const { name, email } = this;
    const id = this.customer_id;

    return JWT.sign({ name, id, email });
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(8));
  }
}

export class Customers {
  /**
   * Return customer with email.
   */

  static async findOne(email) {
    return CustomerModel.query().findOne({
      email
    });
  }

  /**
   * Return customer with email.
   */

  static async findFacebookUser(id) {
    return CustomerModel.query().findOne({ facebook_id: id });
  }

  /**
   * Return customer with id.
   */

  static async findWithId(id) {
    return CustomerModel.query().findById(id);
  }

  /**
   * Create new customer.
   */

  static async createCustomer(data) {
    return CustomerModel.query().insert(data);
  }

  /**
   * Login Customer using email & password.
   */
  static async loginCustomer({ email, password }) {
    const result = await this.findOne(email);
    if (result != null && !bcrypt.compareSync(password, result.password)) {
      return -1;
    }
    return result;
  }

  /**
   * Update customer data.
   */

  static async updateCustomer(data, user) {
    return CustomerModel.query().patchAndFetchById(user.customer_id, data);
  }
}
