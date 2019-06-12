import { Departments } from './department';

let departments;

test('Should get all seed departments.', async () => {
  departments = await Departments.findAll();
  expect(departments.length).toBe(3);
});

test('Should get correct data for specific department.', async () => {
  const department = await Departments.findOne(departments[0].department_id);
  expect(department).not.toBeNull();
  expect(department).toEqual(departments[0]);
});

test('Should return null for wrong department.', async () => {
  const department = await Departments.findOne(departments.length + 1);
  expect(department).toBeNull();
});
