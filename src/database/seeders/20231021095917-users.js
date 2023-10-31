'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const hashedPassword = await bcrypt.hash('password', 10);
      users.push({
        email: `user${i}@test.com`,
        password: hashedPassword,
        role: 'client',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Add admin user
    users.push({
      email: 'admin@test.com',
      password: await bcrypt.hash('password', 10),
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    });
    // Add support user
    users.push({
      email: 'support@test.com',
      password: await bcrypt.hash('password', 10),
      role: 'support',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
