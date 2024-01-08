'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    const pricings = [];

    pricings.push({
      vehicle: 'moto',
      urgency: 'normal',
      units: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'moto',
      urgency: 'urgent',
      units: 2,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'moto',
      urgency: 'direct',
      units: 6,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'normal',
      units: 6,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'urgent',
      units: 10,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'direct',
      units: 20,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'normal',
      units: 10,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'urgent',
      units: 15,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'direct',
      units: 30,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert('pricings', pricings);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('pricings', null, {});
  },
};
