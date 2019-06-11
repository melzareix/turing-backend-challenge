import 'graphql-import-node';
import resolvers from './resolvers';
import typeDefs from './typeDef.graphql';
import errors from '../errors';

export default {
  resolvers,
  typeDefs,
  errors
};
