/**
 * Predefined Error Messages & Codes.
 */

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
  },
  invalid_phone: {
    name: 'invalid_phone',
    status: 400,
    code: 'USR_06',
    message: 'This is an invalid phone number.'
  },
  invalid_cc: {
    name: 'invalid_cc',
    status: 400,
    code: 'USR_08',
    message: 'This is an invalid Credit Card.'
  },
  invalid_email_password: {
    name: 'invalid_email_password',
    status: 400,
    code: 'USR_10',
    message: 'The email/password combination is invalid.'
  },
  user_exists: {
    name: 'user_exists',
    status: 400,
    code: 'USR_11',
    message: 'The user with this facebook account already exists.'
  },
  unauthorized: {
    name: 'unauthorized',
    status: 401,
    code: 'AUT_02',
    message: 'Access Unauthorized'
  },
  default: {
    name: 'default',
    status: 400
  }
};
