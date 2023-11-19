import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from '@/database';

// export const migrator = new Umzug({
//   migrations: {
//     glob: ['migrations/*.ts', { cwd: __dirname }],
//   },
//   context: sequelize,
//   storage: new SequelizeStorage({
//     sequelize,
//   }),
//   logger: console,
// });

export const migrator = new Umzug({
  migrations: { glob: 'src/database/migrations/*.ts' },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
