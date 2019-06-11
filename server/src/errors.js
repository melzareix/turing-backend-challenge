export default {
  password_invalid: {
    name: 'password_invalid',
    status: 400,
    code: 'USR_01',
    message: 'Password is invalid'
  },
  required: {
    name: 'required',
    status: 400,
    code: 'USR_02',
    message: 'The field(s) are/is required.'
  },
  email_invalid: {
    name: 'email_invalid',
    status: 400,
    code: 'USR_03',
    message: 'The email is invalid'
  },
  email_exists: {
    name: 'email_exists',
    status: 400,
    code: 'USR_04',
    message: 'The email already exists'
  },
  email_not_exist: {
    name: 'email_not_exist',
    status: 400,
    code: 'USR_05',
    message: "The email doesn't exist"
  }
};
