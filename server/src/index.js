import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import pino from 'pino';
import passport from 'passport';
import { Model } from 'objection';
import Knex from 'knex';
import { jwtStrategy, facebookStrategy } from './utils/passport';

import departments from './departments';
import customers from './customers';
import attributes from './attributes';
import tax from './tax';
import products from './products';
import categories from './categories';
import shipping from './shipping';
import stripe from './stripe';
import cart from './cart';

import errors from './errors';
import knexConfig from './utils/db';

const logger = pino({
  prettyPrint: true
});

require('dotenv').config();

// Database
Model.knex(Knex(knexConfig));

// Express
const app = express();

// Passport
passport.use(jwtStrategy);
passport.use(facebookStrategy);

passport.initialize();

// GraphQL Server
app.use('/graphql', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      req.user = {
        customer_id: user.customer_id,
        email: user.email
      };
    }
    next();
  })(req, res, next);
});

// Stripe Webhook
app.post('/stripe/webhook', (req, res) => {
  const eventJson = JSON.parse(req.body);
  logger.info(eventJson);
  res.send(200);
});

const server = new ApolloServer({
  typeDefs: [
    departments.typeDefs,
    customers.typeDefs,
    attributes.typeDefs,
    tax.typeDefs,
    products.typeDefs,
    categories.typeDefs,
    shipping.typeDefs,
    stripe.typeDefs,
    cart.typeDefs
  ],
  resolvers: [
    departments.resolvers,
    customers.resolvers,
    attributes.resolvers,
    tax.resolvers,
    products.resolvers,
    categories.resolvers,
    shipping.resolvers,
    stripe.resolvers,
    cart.resolvers
  ],
  formatError: e => {
    if (!errors[e.message])
      return {
        status: 500,
        code: 'UNK_01',
        message: e.message
      };
    const err = Object.assign({}, errors[e.message]);

    delete err.name;
    err.field = e.extensions.exception.field;
    return err;
  },
  context: ({ req, res }) => ({
    req,
    res,
    errors
  })
});

server.applyMiddleware({ app });
app.listen({ port: 4000 }, () => {
  logger.info(`Server started at http://localhost:4000${server.graphqlPath}`);
});
