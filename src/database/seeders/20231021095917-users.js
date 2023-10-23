'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [];
    for (let i = 1; i < 10; i++) {
      users.push({
        email: `user${i}@test.com`,
        password: 'password',
        role: 'client',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
