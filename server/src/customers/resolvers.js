import { Customers } from './customer';
import validateSchema from '../utils/yupValidator';
import { authenticateFacebook } from '../utils/passport';

import {
  customerSignupSchema,
  customerLoginSchema,
  customerUpdateSchema,
  customerAddressUpdateSchema,
  customerCreditCardUpdateSchema
} from './schemas';

const generateLoginResponse = customer => {
  const jwtToken = customer.generateToken();
  return {
    customer: customer.attributes,
    accessToken: jwtToken.accessToken,
    expires_in: jwtToken.expiresIn
  };
};

const resolvers = {
  Query: {
    getCustomer: async (parent, args, { errors, req }) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }
      const customer = await Customers.findWithId(req.user.id);
      return customer.attributes;
    }
  },
  Mutation: {
    signupCustomer: async (parent, { name, email, password }, { errors }) => {
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
      return generateLoginResponse(customer);
    },
    loginCustomer: async (parent, { email, password }, { errors }) => {
      await validateSchema(customerLoginSchema, { email, password }, errors);
      const customer = await Customers.loginCustomer({ email, password });
      if (customer === null) {
        throw new Error(errors.email_not_exist.name);
      } else if (customer === -1) {
        throw new Error(errors.invalid_email_password.name);
      }
      return generateLoginResponse(customer);
    },
    facebookLoginCustomer: async (
      parent,
      { accessToken },
      { req, res, errors }
    ) => {
      req.body = {
        ...req.body,
        access_token: accessToken
      };

      const { data } = await authenticateFacebook(req, res);
      const { profile } = data;
      let customer;

      customer = await Customers.findFacebookUser(profile.id);

      if (!customer) {
        // Create User If not exists
        const newUser = {
          name:
            profile.displayName || `${profile.familyName} ${profile.givenName}`,
          email: profile.emails[0].value,
          password: Math.random()
            .toString(36)
            .slice(-8),
          facebook_id: profile.id
        };

        try {
          customer = await Customers.createCustomer(newUser);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            throw new Error(errors.user_exists.name);
          }
        }
      }

      return generateLoginResponse(customer);
    },
    updateCustomer: async (parent, { customerData }, { req, errors }) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }

      await validateSchema(customerUpdateSchema, customerData, errors);
      let updatedCustomer;

      try {
        updatedCustomer = await Customers.updateCustomer(
          customerData,
          req.user
        );
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new Error(errors.email_exists.name);
        }
        throw error;
      }

      return updatedCustomer.attributes;
    },
    updateCustomerAddress: async (parent, { addressData }, { req, errors }) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }

      await validateSchema(customerAddressUpdateSchema, addressData, errors);
      const updatedCustomer = await Customers.updateCustomer(
        addressData,
        req.user
      );
      return updatedCustomer.attributes;
    },
    updateCustomerCreditCard: async (
      parent,
      { creditCard },
      { req, errors }
    ) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }

      await validateSchema(
        customerCreditCardUpdateSchema,
        { creditCard },
        errors
      );
      const updatedCustomer = await Customers.updateCustomer(
        { credit_card: creditCard },
        req.user
      );
      return updatedCustomer.attributes;
    }
  }
};

export default resolvers;
