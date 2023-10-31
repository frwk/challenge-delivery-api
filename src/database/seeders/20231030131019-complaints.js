'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const complaints = [];
    const deliveries = await queryInterface.sequelize.query(`SELECT id, client_id FROM deliveries;`);
    const deliveryIds = deliveries[0].map(delivery => delivery.id);
    const clientIds = deliveries[0].map(delivery => delivery.client_id);
    for (let i = 1; i <= 10; i++) {
      // We need to remove the id from the array so we don't get duplicate deliveries complaints
      const randomDeliveryId = deliveryIds[Math.floor(Math.random() * deliveryIds.length)];
      deliveryIds.splice(deliveryIds.indexOf(randomDeliveryId), 1);

      const randomClientId = clientIds[Math.floor(Math.random() * clientIds.length)];

      complaints.push({
        delivery_id: randomDeliveryId,
        user_id: randomClientId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('complaints', complaints);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('complaints', null, {});
  },
};
