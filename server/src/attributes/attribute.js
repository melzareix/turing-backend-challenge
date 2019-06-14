import { Model } from 'objection';

export class AttributesModel extends Model {
  static get tableName() {
    return 'attribute';
  }

  static get idColumn() {
    return 'attribute_id';
  }
}

export class AttributesValues extends Model {
  static get tableName() {
    return 'attribute_value';
  }

  static get idColumn() {
    return 'attribute_value_id';
  }
}

export class Attributes {
  /*
   * Return all attributes.
   */

  static async findAll() {
    return AttributesModel.query();
  }

  /**
   * Return single attribute.
   */

  static async findOne(id) {
    return AttributesModel.query().findById(id);
  }

  /**
   * Return all values for a single attribute.
   */
  static async getAttributeValues(attributeId) {
    return AttributesValues.query().where({
      attribute_id: attributeId
    });
  }

  /**
   * Get all attributes for product.
   */
  static async getProductAttributes(id) {
    const results = await Model.knex().raw(
      'call catalog_get_product_attributes(?);',
      [id]
    );
    return results[0][0];
  }
}
