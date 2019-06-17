import { Model } from 'objection';

/**
 * ORM Model for DB Shipping Region Table.
 */

/* istanbul ignore next */
export class ShippingRegionModel extends Model {
  static get tableName() {
    return 'shipping_region';
  }

  static get idColumn() {
    return 'shipping_region_id';
  }
}

/**
 * ORM Model for DB Shipping Table.
 */

/* istanbul ignore next */
export class ShippingModel extends Model {
  static get tableName() {
    return 'shipping';
  }

  static get idColumn() {
    return 'shipping_id';
  }

  static get relationMappings() {
    return {
      // get all regions for the shipping
      regions: {
        relation: Model.HasOneRelation,
        modelClass: ShippingRegionModel,
        join: {
          from: 'shipping.shipping_region_id',
          to: 'shipping_region.shipping_region_id'
        }
      }
    };
  }
}

export class Shipping {
  /**
   * Get All shipping regions.
   */
  static async findAllRegions() {
    return ShippingRegionModel.query();
  }

  /**
   * Get shipping types for a specific shipping region.
   */
  static async getRegionTypes(id) {
    return ShippingModel.query().where({
      shipping_region_id: id
    });
  }
}
