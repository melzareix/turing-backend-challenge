import Knex from 'knex';
import faker from 'faker';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Products } from './product';
import { CustomerModel, Customers } from '../customers/customer';

let products;
let customer;

const customerData = {
  customer_id: faker.random.number({ min: 1000, max: 2000 }),
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.name.firstName()
};

const DB_DEFAULT_PRODUCTS_COUNT = 101;
const DEFAULT_LIMIT = 20;

/**
 * Initialize database.
 */

beforeAll(async () => {
  Model.knex(Knex(knexConfig));
  customer = await Customers.createCustomer(customerData);
});

test('should get all products.', async () => {
  products = await Products.findAll();
  expect(products.results.length).toBe(DEFAULT_LIMIT);
  expect(products.total).toBe(DB_DEFAULT_PRODUCTS_COUNT);
});

test('should get the correct product data.', async () => {
  const product =
    (await Products.findOne(products.results[0].product_id)) || null;
  expect(product).not.toBeNull();
  expect(product).toEqual(products.results[0]);
});

test('should return null for incorrect product id.', async () => {
  const product = (await Products.findOne(products.total + 1)) || null;
  expect(product).toBeNull();
});

test('should truncate description correctly.', async () => {
  const results = [];
  for (let i = 0; i < 100; i += 1) {
    results.push({
      description: faker.random.alphaNumeric(
        faker.random.number({ min: 5, max: 50 })
      )
    });
  }

  const truncResult = Products.truncate({ results }, 30);
  truncResult.forEach(item => {
    expect(item.description.length).toBeLessThanOrEqual(30 + 3);
  });
});

test('should search for products.', async () => {
  const booleanMode = await Products.searchProducts('good beautiful');
  const noBooleanMode = await Products.searchProducts('good beautiful', false);

  expect(booleanMode.count).toBe(28);
  expect(noBooleanMode.count).toBe(28);
});

test('should get product locations.', async () => {
  const location = await Products.getProductLocation(1);
  expect(location.length).toBe(1);
  expect(location[0].category_id).toBe(1);
  expect(location[0].department_id).toBe(1);
});

test('should get all products in a category.', async () => {
  const { count } = await Products.getProductsInCategory(1, {
    page: 1,
    limit: 20
  });

  const nonExistentCategoryProducts = await Products.getProductsInCategory(
    122323,
    {
      page: 1,
      limit: 20
    }
  );
  expect(nonExistentCategoryProducts.count).toBe(0);
  expect(count).toBe(18);
});

test('should get all products in a department.', async () => {
  const { count } = await Products.getProductsInDepartment(1, {
    page: 1,
    limit: 50
  });

  expect(count).toBe(35);
});

test('should add review to the product.', async () => {
  await Products.addReview({
    customerId: customer.customer_id,
    productId: 1,
    review: 'hello world',
    rating: 5
  });

  const reviews = await Products.getProductReviews(1);
  expect(reviews.length).toBe(1);
  expect(reviews[0].customer_id).toBe(customer.customer_id);
});

afterAll(async () => {
  await CustomerModel.query().deleteById(customerData.customer_id);
});
