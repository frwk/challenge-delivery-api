require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
  require('ts-node/register');
  require('tsconfig-paths/register');
}
require('./umzug').migrator.runAsCLI();
