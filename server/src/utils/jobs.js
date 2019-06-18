import { Model } from 'objection';
import cron from 'node-cron';
import pino from 'pino';

const DAY_TO_DELETE = 7;
const logger = pino({
  prettyPrint: true
});
export const clearOldCarts = async () => {
  await Model.knex().raw('call shopping_cart_delete_old_carts(?)', [
    DAY_TO_DELETE
  ]);
  logger.info('Carts cleared!');
};

export const scheduleCartsDeletion = () => {
  cron.schedule('0 5 * * *', clearOldCarts);
};
