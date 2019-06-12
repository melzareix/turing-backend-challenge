import * as yup from 'yup';
import cardValidator from 'card-validator';

/**
 * YUP Schemas
 */
export const customerSignupSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required()
});

export const customerLoginSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required()
});

const phoneRegex = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
export const customerUpdateSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  name: yup.string().required(),
  password: yup.string(),
  day_phone: yup
    .string()
    .matches(phoneRegex, 'This is an invalid phone number.'),
  eve_phone: yup
    .string()
    .matches(phoneRegex, 'This is an invalid phone number.'),
  mob_phone: yup
    .string()
    .matches(phoneRegex, 'This is an invalid phone number.')
});

export const customerAddressUpdateSchema = yup.object().shape({
  address_1: yup.string().required(),
  address_2: yup.string(),
  city: yup.string().required(),
  region: yup.string().required(),
  postal_code: yup.string().required(),
  country: yup.string().required(),
  shipping_region_id: yup.number()
});

export const customerCreditCardUpdateSchema = yup.object().shape({
  creditCard: yup
    .string()
    .test(
      'test-creditcard',
      'This is an invalid Credit Card',
      value => cardValidator.number(value).isValid
    )
    .required()
});
