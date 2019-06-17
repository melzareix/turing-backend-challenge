import { Order } from './order';
import sendMail from '../utils/email';

/**
 * GraphQL Resolver functions.
 */
const resolvers = {
  Query: {
    orders: async (_, args, { req, errors }) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }
      return Order.findAll(req.user.customer_id);
    },
    order: async (parent, { orderId }, { req, errors }) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }
      return Order.getOrderItems(orderId, req.user.customer_id);
    },
    orderShortDetail: async (parent, { orderId }, { req, errors }) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }
      return Order.findOne(orderId, req.user.customer_id);
    }
  },
  Mutation: {
    createOrder: async (_, { order }, { req, errors }) => {
      if (!req.user) {
        throw new Error(errors.unauthorized.name);
      }
      const newOrder = await Order.createOrder({
        customer_id: req.user.customer_id,
        ...order
      });

      sendMail(newOrder, req.user);
      return {
        order_id: newOrder
      };
    }
  }
};

export default resolvers;
