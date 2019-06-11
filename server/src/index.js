import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import pino from 'pino';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import departments from './departments';
import customers from './customers';
import errors from './errors';
import db from './utils/db';

const logger = pino({
  prettyPrint: true
});

require('dotenv').config();

// Express
const app = express();
passport.initialize();

// GraphQL Server
app.use('/graphql', (req, res, next) => {
  return next();
});

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

server.applyMiddleware({ app });
app.listen({ port: 4000 }, () => {
  logger.info(`Server started at http://localhost:4000${server.graphqlPath}`);
});
