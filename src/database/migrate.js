require('ts-node/register');
require('tsconfig-paths/register');
require('./umzug').migrator.runAsCLI();
