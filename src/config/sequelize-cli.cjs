const { config } = require('dotenv');
// config({ path: process.env.NODE_ENV !== 'development' ? `.env.${process.env.NODE_ENV}` : '.env' });
config({ path: '.env' });

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE } = process.env;

module.exports = {
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  port: POSTGRES_PORT,
  host: POSTGRES_HOST,
  dialect: 'postgres',
  migrationStorageTableName: 'sequelize_migrations',
  seederStorageTableName: 'sequelize_seeds',
};
