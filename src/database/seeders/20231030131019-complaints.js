'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    function randomDateBetweenNowAndThreeMonthsAgo() {
      return new Date(
        Math.random() * (new Date().getTime() - new Date().setMonth(new Date().getMonth() - 3)) + new Date().setMonth(new Date().getMonth() - 3),
      );
    }

    const complaints = [];
    const deliveries = await queryInterface.sequelize.query(`SELECT id, client_id FROM deliveries;`);
    const deliveryIds = deliveries[0].map(delivery => delivery.id);
    const clientIds = deliveries[0].map(delivery => delivery.client_id);
    for (let i = 1; i <= 100; i++) {
      // We need to remove the id from the array so we don't get duplicate deliveries complaints
      const randomDeliveryId = deliveryIds[Math.floor(Math.random() * deliveryIds.length)];
      deliveryIds.splice(deliveryIds.indexOf(randomDeliveryId), 1);

      const randomClientId = clientIds[Math.floor(Math.random() * clientIds.length)];
      const date = randomDateBetweenNowAndThreeMonthsAgo();
      complaints.push({
        delivery_id: randomDeliveryId,
        user_id: randomClientId,
        status: Math.random() > 0.8 ? 'pending' : 'resolved',
        created_at: date,
        updated_at: date,
      });
    }
    await queryInterface.bulkInsert('complaints', complaints);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('complaints', null, {});
  },
};
