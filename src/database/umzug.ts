import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from '@/database';
import 'dotenv/config';

export const migrator = new Umzug({
  migrations: { glob: process.env.NODE_ENV === 'production' ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts' },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
