import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Category } from './category';

let categories;
const DB_DEFAULT_CATEGORIES = 7;
const PRODUCT_ID = 1;
const DEP_ID = 1;

/**
 * Initialize database.
 */

beforeAll(() => {
  Model.knex(Knex(knexConfig));
});

test('should get all seed categories.', async () => {
  categories = (await Category.findAll({
    page: 1,
    limit: 20,
    order: 'category_id'
  })).results;
  expect(categories.length).toBe(DB_DEFAULT_CATEGORIES);
});

test('should get correct data for specific category.', async () => {
  const category = (await Category.findOne(categories[0].category_id)) || null;
  expect(category).not.toBeNull();
  expect(category).toEqual(categories[0]);
});

test('should return null for wrong category.', async () => {
  const category = (await Category.findOne(categories.length + 1)) || null;
  expect(category).toBeNull();
});

test('should get correct categories for a product', async () => {
  const cats = await Category.getProductCategories(PRODUCT_ID);
  expect(cats.length).toBe(1);
  expect(cats[0].category_id).toBe(1);
});

test('should return empty array when product has no categories', async () => {
  const cats = await Category.getProductCategories(13743484324);
  expect(cats.length).toBe(0);
});

test('should get correct categories for a department', async () => {
  const cats = await Category.getDepartmentCategories(DEP_ID);
  expect(cats.length).toBe(3);
});

test('should return empty array when department has no categories', async () => {
  const cats = await Category.getDepartmentCategories(31243242);
  expect(cats.length).toBe(0);
});
