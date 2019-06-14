import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Departments } from './department';

let departments;

beforeAll(() => {
  Model.knex(Knex(knexConfig));
});

test('Should get all seed departments.', async () => {
  departments = await Departments.findAll();
  expect(departments.length).toBe(3);
});

test('Should get correct data for specific department.', async () => {
  const department =
    (await Departments.findOne(departments[0].department_id)) || null;
  expect(department).not.toBeNull();
  expect(department).toEqual(departments[0]);
});

test('Should return null for wrong department.', async () => {
  const department =
    (await Departments.findOne(departments.length + 1)) || null;
  expect(department).toBeNull();
});
