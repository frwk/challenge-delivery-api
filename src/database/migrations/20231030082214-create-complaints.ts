import { DataTypes } from 'sequelize';
import type { Migration } from '../umzug';

export const up: Migration = async ({ context }) => {
  await context.getQueryInterface().createTable('complaints', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    delivery_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'deliveries',
        key: 'id',
      },
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved'),
      allowNull: false,
      defaultValue: 'pending',
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};

export const down: Migration = async ({ context }) => {
  await context.getQueryInterface().dropTable('complaints', {
    force: true,
  });
};
