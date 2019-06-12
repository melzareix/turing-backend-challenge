import * as yup from 'yup';
import { Customers, JWT } from './customer';

/*
  Validate the given schema.
*/
const validateSchema = async (schema, args, errors) => {
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

const customerLoginSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required()
});

const resolvers = {
  Mutation: {
    customerSignup: async (parent, { name, email, password }, { errors }) => {
      await validateSchema(
        customerSignupSchema,
        { name, email, password },
        errors
      );
      let customer;
      try {
        customer = await Customers.createCustomer({ name, email, password });
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new Error(errors.email_exists.name);
        }
      }
      const { accessToken, expiresIn } = customer.generateToken();
      return {
        customer: customer.attributes,
        accessToken,
        expires_in: expiresIn
      };
    },
    customerLogin: async (parent, { email, password }, { errors }) => {
      await validateSchema(customerLoginSchema, { email, password }, errors);
      const customer = await Customers.loginCustomer({ email, password });
      if (customer === null) {
        throw new Error(errors.email_not_exist.name);
      }
      const { accessToken, expiresIn } = JWT.sign({
        name: customer.name,
        id: customer.customer_id,
        email
      });
      return {
        customer,
        accessToken,
        expires_in: expiresIn
      };
    }
  }
};

export default resolvers;
