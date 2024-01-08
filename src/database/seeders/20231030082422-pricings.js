'use strict';
/** @type {import('sequelize-cli').Migration} */

// Acceptance delay :
// Direct : 10min
// Urgent : 15min
// Normal : 20min

module.exports = {
  async up(queryInterface) {
    const pricings = [];

    pricings.push({
      vehicle: 'moto',
      urgency: 'normal',
      units: 1,
      acceptance_delay: 1200,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'moto',
      urgency: 'urgent',
      units: 2,
      acceptance_delay: 900,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'moto',
      urgency: 'direct',
      acceptance_delay: 600,
      units: 6,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'normal',
      units: 6,
      acceptance_delay: 1200,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'urgent',
      units: 10,
      acceptance_delay: 900,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'car',
      urgency: 'direct',
      units: 20,
      acceptance_delay: 600,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'normal',
      units: 10,
      acceptance_delay: 1200,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'urgent',
      units: 15,
      acceptance_delay: 900,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'truck',
      urgency: 'direct',
      acceptance_delay: 600,
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
