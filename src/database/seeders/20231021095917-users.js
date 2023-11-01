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
      const hashedPassword = await bcrypt.hash('password', 2);
      const date = randomDateBetweenNowAndThreeMonthsAgo();
      users.push({
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
      email: 'admin@test.com',
      first_name: 'Admin',
      last_name: 'Doe',
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
