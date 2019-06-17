import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Shipping } from './shipping';

let regions;

const DB_DEFAULT_SHIPPING_REGIONS = 4;

/**
 * Initialize database.
 */

beforeAll(() => {
  Model.knex(Knex(knexConfig));
});

test('should get all shipping regions.', async () => {
  regions = await Shipping.findAllRegions();
  expect(regions.length).toBe(DB_DEFAULT_SHIPPING_REGIONS);
});

test('should get the correct region type.', async () => {
  const region = await Shipping.getRegionTypes(regions[1].shipping_region_id);
  expect(region[0].shipping_region_id).toBe(regions[1].shipping_region_id);
});

test('Should return null for incorrect shipping region id.', async () => {
  const shipping = await Shipping.getRegionTypes(regions.length + 1);
  expect(shipping.length).toBe(0);
});
