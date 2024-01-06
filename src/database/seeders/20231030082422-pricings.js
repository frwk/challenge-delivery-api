'use strict';
/** @type {import('sequelize-cli').Migration} */


module.exports = {
  async up(queryInterface) {
    const pricings = [];

    // Moto
    pricings.push({
      vehicle: 'Moto',
      urgency: 'Normal',
      units: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'Moto',
      urgency: 'Urgent',
      units: 2,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'Moto',
      urgency: 'Direct',
      units: 6,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Voiture
    pricings.push({
      vehicle: 'Voiture',
      urgency: 'Normal',
      units: 6,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'Voiture',
      urgency: 'Urgent',
      units: 10,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'Voiture',
      urgency: 'Direct',
      units: 20,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Camion
    pricings.push({
      vehicle: 'Camion',
      urgency: 'Normal',
      units: 10,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'Camion',
      urgency: 'Urgent',
      units: 15,
      created_at: new Date(),
      updated_at: new Date(),
    });

    pricings.push({
      vehicle: 'Camion',
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
