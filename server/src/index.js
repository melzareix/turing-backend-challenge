import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import pino from 'pino';
import passport from 'passport';
import { jwtStrategy, facebookStrategy } from './utils/passport';
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

passport.use(jwtStrategy);
passport.use(facebookStrategy);

passport.initialize();

// GraphQL Server
app.use('/graphql', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      req.user = {
        customer_id: user.attributes.customer_id,
        email: user.attributes.email
      };
    }
    next();
  })(req, res, next);
});

const server = new ApolloServer({
  typeDefs: [departments.typeDefs, customers.typeDefs],
  resolvers: [departments.resolvers, customers.resolvers],
  formatError: e => {
    if (!errors[e.message]) return e;
    const err = Object.assign({}, errors[e.message]);

    delete err.name;
    err.field = e.extensions.exception.field;
    return err;
  },
  context: ({ req, res }) => ({
    req,
    res,
    db,
    errors
  })
});

server.applyMiddleware({ app });
app.listen({ port: 4000 }, () => {
  logger.info(`Server started at http://localhost:4000${server.graphqlPath}`);
});
