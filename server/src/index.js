import { ApolloServer } from 'apollo-server';
import pino from 'pino';
import departments from './departments';
import customers from './customers';
import errors from './errors';
import db from './utils/db';

const logger = pino({
  prettyPrint: true
});

require('dotenv').config();

// GraphQL Server
const server = new ApolloServer({
  typeDefs: [departments.typeDefs, customers.typeDefs],
  resolvers: [departments.resolvers, customers.resolvers],
  formatError: e => {
    const err = errors[e.message];
    if (err) return err;
    return e;
  },
  context: req => ({
    ...req,
    db,
    errors
  })
});

server.listen().then(({ url }) => logger.info(`Server started at ${url}`));
