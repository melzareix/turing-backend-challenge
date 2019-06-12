import { ApolloError } from 'apollo-server-express';

/*
  YUP Schema Validator.
*/
export default async (schema, args, errors) => {
  try {
    await schema.validate(args);
  } catch (error) {
    if (error.name === 'ValidationError') {
      let newError;
      if (error.type === 'required') {
        newError = errors.required;
      } else if (error.path === 'email') {
        newError = errors.email_invalid;
      } else if (error.path === 'password') {
        newError = errors.password_invalid;
      } else if (error.path.indexOf('_phone') !== -1) {
        newError = errors.invalid_phone;
      } else {
        newError = errors.default;
        newError.message = error.message;
      }
      throw new ApolloError(newError.name, newError.status, {
        field: error.path
      });
    }
  }
};
