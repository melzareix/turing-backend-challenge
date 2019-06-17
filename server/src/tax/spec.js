import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Tax } from './tax';

let taxes;

const DB_DEFAULT_TAXES = 2;

/**
 * Initialize database.
 */

beforeAll(() => {
  Model.knex(Knex(knexConfig));
});

test('should get all taxes.', async () => {
  taxes = await Tax.findAll();
  expect(taxes.length).toBe(DB_DEFAULT_TAXES);
});

test('should get the correct tax data.', async () => {
  const tax = (await Tax.findOne(taxes[0].tax_id)) || null;
  expect(tax).not.toBeNull();
  expect(tax).toEqual(taxes[0]);
});

test('Should return null for incorrect tax id.', async () => {
  const tax = (await Tax.findOne(taxes.length + 1)) || null;
  expect(tax).toBeNull();
});
