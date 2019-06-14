import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Tax } from './tax';

let taxes;

beforeAll(() => {
  Model.knex(Knex(knexConfig));
});

test('Should get all attributes.', async () => {
  taxes = await Tax.findAll();
  expect(taxes.length).toBe(2);
});

test('Should get correct data for specific attribute.', async () => {
  const tax = (await Tax.findOne(taxes[0].tax_id)) || null;
  expect(tax).not.toBeNull();
  expect(tax).toEqual(taxes[0]);
});

test('Should return null for wrong attribute.', async () => {
  const tax = (await Tax.findOne(taxes.length + 1)) || null;
  expect(tax).toBeNull();
});
