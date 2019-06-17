import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Attributes } from './attribute';

let attributes;

const DB_DEFAULT_ATTRIBUTES = 2;

/**
 * Initialize database.
 */

beforeAll(() => {
  Model.knex(Knex(knexConfig));
});

test('should get all attributes.', async () => {
  attributes = await Attributes.findAll();
  expect(attributes.length).toBe(DB_DEFAULT_ATTRIBUTES);
});

test('should get the correct attribute data.', async () => {
  const attribute =
    (await Attributes.findOne(attributes[0].attribute_id)) || null;
  expect(attribute).not.toBeNull();
  expect(attribute).toEqual(attributes[0]);
});

test('should return null for incorrect attribute id.', async () => {
  const attribute = (await Attributes.findOne(attributes.length + 1)) || null;
  expect(attribute).toBeNull();
});

test('should get all values for the attribute.', async () => {
  const values = await Attributes.getAttributeValues(1);
  expect(values.length).toBe(5);
});

test('should get all attributes for a specific product.', async () => {
  const values = await Attributes.getProductAttributes(1);
  expect(values.length).toBe(14);
});
