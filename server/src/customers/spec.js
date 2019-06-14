import faker from 'faker';
import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../utils/db';
import { Customers } from './customer';

const _customers = [];
const _customersData = [];

beforeAll(() => {
  Model.knex(Knex(knexConfig));
  for (let i = 0; i < 3; i += 1) {
    _customers.push({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.firstName()
    });
    _customersData.push({
      credit_card: '5555555555554444',
      address_1: faker.address.streetAddress(),
      city: faker.address.city(),
      region: faker.address.state(),
      country: faker.address.country(),
      shipping_region_id: 1,
      postal_code: faker.address.zipCode()
    });
  }
});

test('Should create & add user to database.', async () => {
  const _customer = _customers[0];
  await Customers.createCustomer(_customer);

  const newCustomer = await Customers.findOne(_customer.email);
  const { name, email } = newCustomer;

  expect(name).toBe(_customer.name);
  expect(email).toBe(_customer.email);
});

test('Should update customer information.', async () => {
  const _customer = _customers[0];
  const _customerData = _customersData[0];

  const existingCustomer = await Customers.findOne(_customer.email);

  const updatedCustomer = await Customers.updateCustomer(
    _customerData,
    existingCustomer
  );

  expect(updatedCustomer.credit_card).toBe(_customerData.credit_card);
  expect(updatedCustomer.address_1).toBe(_customerData.address_1);
  expect(updatedCustomer.city).toBe(_customerData.city);
  expect(updatedCustomer.region).toBe(_customerData.region);
  expect(updatedCustomer.country).toBe(_customerData.country);
  expect(updatedCustomer.shipping_region_id).toBe(
    _customerData.shipping_region_id
  );
  expect(updatedCustomer.postal_code).toBe(_customerData.postal_code);
});

test('Should not create users with same email.', async () => {
  const _customer = _customers[0];
  await expect(Customers.createCustomer(_customer)).rejects.toThrow();
});

test('should login with the right credentials.', async () => {
  const _customer = _customers[0];
  const customer = (await Customers.loginCustomer(_customer)) || null;

  expect(customer).not.toBeNull();
  expect(customer).not.toBe(-1);
  expect(customer.email).toBe(_customer.email);
});

test('should not login with wrong email.', async () => {
  const _customer = _customers[1];
  const customer = (await Customers.loginCustomer(_customer)) || null;

  expect(customer).toBeNull();
});

test('should not login with wrong password.', async () => {
  const _customer = _customers[0];
  const customer = await Customers.loginCustomer({
    email: _customer.email,
    password: 'random_password'
  });

  expect(customer).toBe(-1);
});
