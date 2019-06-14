import { Model } from 'objection';

export class TaxModel extends Model {
  static get tableName() {
    return 'tax';
  }

  static get idColumn() {
    return 'tax_id';
  }
}

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
