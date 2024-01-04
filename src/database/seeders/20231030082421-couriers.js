'use strict';
const bcrypt = require('bcryptjs');
const { getRandomParisCoordinates } = require('./scripts/helpers');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [];
    const couriers = [];
    const statusOptions = ['available', 'unavailable', 'on_delivery'];

    for (let i = 203; i <= 213; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      users.push({
        first_name: `Firstname${i}`,
        last_name: `Lastname${i}`,
        email: `user${i}@test.com`,
        first_name: `Courier${i}`,
        last_name: `Doe`,
        password: hashedPassword,
        role: 'courier',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    for (let i = 203; i < 213; i++) {
      const randomCoordinates = getRandomParisCoordinates();
      couriers.push({
        user_id: i,
        status: statusOptions[i % statusOptions.length],
        latitude: randomCoordinates.latitude,
        longitude: randomCoordinates.longitude,
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
