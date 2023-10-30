'use strict';

const { random } = Math;

module.exports = {
  async up(queryInterface) {
    const deliveries = [];
    const statusOptions = ['pending', 'picked_up', 'delivered', 'cancelled'];

    for (let i = 1; i <= 10; i++) {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const differenceInTime = now.getTime() - threeMonthsAgo.getTime();

      const randomTimeBetweenNowAndThreeMonthsAgo = threeMonthsAgo.getTime() + random() * differenceInTime;
      const pickupDate = new Date(randomTimeBetweenNowAndThreeMonthsAgo);

      const dropoffDate = new Date(pickupDate.getTime() + 15 * 60 * 1000 + random() * (2 * 60 * 60 * 1000 - 15 * 60 * 1000)); // Entre 15 minutes et 2 heures

      const confirmationCode = `${Math.floor(1000 + random() * 9000)}`; // Code à 4 chiffres

      deliveries.push({
        pickup: `48.${Math.floor(100 + random() * 100)},2.${Math.floor(5 + random() * 10)}`, // Coordonnées GPS approximatives pour l'Ile-de-France
        dropoff: `48.${Math.floor(100 + random() * 100)},2.${Math.floor(5 + random() * 10)}`, // Coordonnées GPS approximatives pour l'Ile-de-France
        pickup_date: pickupDate,
        dropoff_date: dropoffDate,
        client_id: i,
        courier_id: i,
        confirmation_code: confirmationCode,
        status: statusOptions[i % statusOptions.length],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('deliveries', deliveries);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('deliveries', null, {});
  },
};
