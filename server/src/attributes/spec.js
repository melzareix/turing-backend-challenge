import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Attributes } from './attribute';

let attributes;

beforeAll(() => {
  Model.knex(Knex(knexConfig));
});

test('Should get all attributes.', async () => {
  attributes = await Attributes.findAll();
  expect(attributes.length).toBe(2);
});

test('Should get correct data for specific attribute.', async () => {
  const attribute =
    (await Attributes.findOne(attributes[0].attribute_id)) || null;
  expect(attribute).not.toBeNull();
  expect(attribute).toEqual(attributes[0]);
});

test('Should return null for wrong attribute.', async () => {
  const attribute = (await Attributes.findOne(attributes.length + 2)) || null;
  expect(attribute).toBeNull();
});
