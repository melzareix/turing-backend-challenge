import { Model } from 'objection';

/**
 * ORM Model for DB Tax Table.
 */

/* istanbul ignore next */
export class TaxModel extends Model {
  static get tableName() {
    return 'tax';
  }

  static get idColumn() {
    return 'tax_id';
  }
}

/**
 * Tax Repository.
 */
export class Tax {
  /**
   * Get All Taxes.
   */
  static async findAll() {
    return TaxModel.query();
  }

  /**
   * Get Specific Tax.
   */
  static async findOne(id) {
    return TaxModel.query().findById(id);
  }
}
