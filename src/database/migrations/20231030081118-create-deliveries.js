'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deliveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pickup: {
        type: Sequelize.STRING,
      },
      dropoff: {
        type: Sequelize.STRING,
      },
      pickup_date: {
        type: Sequelize.DATE,
      },
      dropoff_date: {
        type: Sequelize.DATE,
      },
      client_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      courier_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'couriers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      confirmation_code: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('pending', 'picked_up', 'delivered', 'cancelled'),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('deliveries');
  },
};
