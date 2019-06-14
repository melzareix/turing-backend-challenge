import { Shipping } from './shipping';

const resolvers = {
  Query: {
    shippingRegions: async () => {
      return Shipping.findAllRegions();
    },
    shippingRegionTypes: async (_, { shippingRegionId }) => {
      return Shipping.getRegionTypes(shippingRegionId);
    }
  }
};

export default resolvers;
