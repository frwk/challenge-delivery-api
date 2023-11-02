'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    function randomDateBetweenNowAndThreeMonthsAgo() {
      return new Date(
        Math.random() * (new Date().getTime() - new Date().setMonth(new Date().getMonth() - 3)) + new Date().setMonth(new Date().getMonth() - 3),
      );
    }
    const users = [];
    for (let i = 1; i <= 200; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const date = randomDateBetweenNowAndThreeMonthsAgo();
      users.push({
        first_name: `Firstname${i}`,
        last_name: `Lastname${i}`,
        email: `user${i}@test.com`,
        first_name: `User${i}`,
        last_name: `Doe`,
        password: hashedPassword,
        role: 'client',
        created_at: date,
        updated_at: date,
      });
    }

    // Add admin user
    users.push({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@test.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    });
    // Add support user
    users.push({
      first_name: 'Support',
      last_name: 'User',
      email: 'support@test.com',
      password: await bcrypt.hash('password123', 10),
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
