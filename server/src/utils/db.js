import knex from 'knex';
import bookshelf from 'bookshelf';

require('dotenv').config();

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
  }
};

// bookshelf orm
const orm = bookshelf(knex(config));
orm.plugin('pagination');

export default orm;
