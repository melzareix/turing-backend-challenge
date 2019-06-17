import stripe from 'stripe';

require('dotenv').config();

// create stripe client
const client = stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe GraphQL Resolvers.
 */
const resolvers = {
  Mutation: {
    stripeCharge: async (_, { order }) => {
      // eslint-disable-next-line camelcase
      const { amount, description, stripeToken, order_id, currency } = order;
      return client.charges.create({
        amount: amount * 100,
        description,
        metadata: { order_id },
        currency,
        source: stripeToken
      });
    }
  }
};

export default resolvers;
