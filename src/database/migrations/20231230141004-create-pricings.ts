import { DataTypes } from 'sequelize';
import type { Migration } from '../umzug';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('pricings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicle: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    urgency: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    units: {
      type: DataTypes.INTEGER,
    },
    acceptance_delay: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('pricings', {
    force: true,
  });
};
