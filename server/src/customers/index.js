import 'graphql-import-node';
import resolvers from './resolvers';
import typeDefs from './typeDef.graphql';
import errors from '../errors';
import { Customers } from './customer';

export default {
  resolvers,
  typeDefs,
  errors,
  Customers
};
