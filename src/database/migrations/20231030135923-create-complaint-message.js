'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable('complaint_messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      complaint_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'complaints',
          key: 'id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
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

  async down(queryInterface) {
    return await queryInterface.dropTable('complaint_messages');
  },
};
