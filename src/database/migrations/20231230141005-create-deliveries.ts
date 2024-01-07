import { DataTypes } from 'sequelize';
import type { Migration } from '../umzug';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('deliveries', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    pickup_latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    pickup_longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    dropoff_latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    dropoff_longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    pickup_date: {
      type: DataTypes.DATE,
    },
    dropoff_date: {
      type: DataTypes.DATE,
    },
    client_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    courier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'couriers',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    pricing_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'pricings',
        key: 'id',
      },
    },
    confirmation_code: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'picked_up', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    notation: {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.DECIMAL,
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

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('deliveries', {
    force: true,
  });
};
