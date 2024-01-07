'use strict';
const bcrypt = require('bcryptjs');
const { getRandomParisCoordinates } = require('./scripts/helpers');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [];
    const couriers = [];
    const statusOptions = ['available', 'unavailable', 'on_delivery'];
    const vehicleOptions = ['moto', 'car', 'truck'];

    for (let i = 203; i <= 213; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      users.push({
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
        vehicle: vehicleOptions[i % vehicleOptions.length],
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
