'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [];
    const couriers = [];
    for (let i = 1; i <= 10; i++) {
      const hashedPassword = await bcrypt.hash('password', 10);
      users.push({
        email: `user${i + 10}@test.com`,
        password: hashedPassword,
        role: 'courier',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    for (let i = 1; i <= 10; i++) {
      couriers.push({
        user_id: i,
        is_available: i % 2 === 0 ? true : false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('users', users);
    await queryInterface.bulkInsert('couriers', couriers);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('couriers', null, {});
  },
};
