import * as yup from 'yup';
import { Customers } from './customer';

/*
  Validate the given schema.
*/
const validateSchema = async (schema, args, errors) => {
  try {
    schema.validate(args);
  } catch (error) {
    if (error.name === 'ValidationError') {
      let newError;
      if (error.type === 'required') {
        newError = errors.required;
      } else if (error.path === 'email') {
        newError = errors.email_invalid;
      } else if (error.path === 'password') {
        newError = errors.password_invalid;
      } else {
        newError = errors.default;
        newError.message = error.message;
      }
      throw new Error(newError.name);
    }
  }
};

/**
 * Input Schemas.
 */
const customerSignupSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required()
});

const resolvers = {
  Mutation: {
    customerSignup: async (parent, args, { errors }) => {
      await validateSchema(customerSignupSchema, args, errors);
      return null;
    }
  }
};

export default resolvers;
