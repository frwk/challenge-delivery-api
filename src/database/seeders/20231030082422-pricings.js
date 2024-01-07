'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    const pricings = [];

    pricings.push({
      vehicle: 'moto',
      urgency: 'Normal',
      units: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'moto',
      urgency: 'Urgent',
      units: 2,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'moto',
      urgency: 'Direct',
      units: 6,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'Normal',
      units: 6,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'Urgent',
      units: 10,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'Direct',
      units: 20,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'Normal',
      units: 10,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'Urgent',
      units: 15,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'Direct',
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
