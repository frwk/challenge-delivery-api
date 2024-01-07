'use strict';

const { random } = Math;
const { getRandomRoute } = require('./scripts/helpers');

module.exports = {
  async up(queryInterface) {
    const deliveries = [];
    const statusOptions = ['pending', 'accepted', 'picked_up', 'delivered', 'cancelled'];
    const couriers = await queryInterface.sequelize.query(`SELECT id, status FROM couriers;`);
    const notAssignedOnDeliveryCouriers = couriers[0].filter(courier => courier.status === 'on_delivery');

    for (let i = 1; i <= 200; i++) {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const differenceInTime = now.getTime() - threeMonthsAgo.getTime();

      const randomTimeBetweenNowAndThreeMonthsAgo = threeMonthsAgo.getTime() + random() * differenceInTime;
      const potentialPickupDate = new Date(randomTimeBetweenNowAndThreeMonthsAgo);
      const potentialDropoffDate = new Date(potentialPickupDate.getTime() + 15 * 60 * 1000 + random() * (2 * 60 * 60 * 1000 - 15 * 60 * 1000));

      const confirmationCode = `${Math.floor(1000 + random() * 9000)}`;

      const { pickupAddress, dropoffAddress, pickupCoordinates, dropoffCoordinates } = getRandomRoute();
      let status = statusOptions[i % statusOptions.length];
      let courier = null;
      let pickupDate = null;
      let dropoffDate = null;
      let notation = null;

      if (status === 'delivered') {
        pickupDate = potentialPickupDate;
        dropoffDate = potentialDropoffDate;
        notation = Math.floor(Math.random() * 5) + 1;
      } else if (status === 'picked_up') {
        pickupDate = potentialPickupDate;
      }

      if (status === 'accepted' || status === 'picked_up') {
        if (notAssignedOnDeliveryCouriers.length > 0) {
          courier = notAssignedOnDeliveryCouriers.pop(); // Assign a courier who is not already on delivery
        } else {
          status = 'pending'; // No couriers available, revert to pending status
        }
      } else if (status !== 'pending') {
        const otherCouriers = couriers[0].filter(courier => courier.status === 'available' || courier.status === 'unavailable');
        courier = otherCouriers[Math.floor(Math.random() * otherCouriers.length)];
      }

      deliveries.push({
        pickup_latitude: pickupCoordinates.latitude,
        pickup_longitude: pickupCoordinates.longitude,
        dropoff_latitude: dropoffCoordinates.latitude,
        dropoff_longitude: dropoffCoordinates.longitude,
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        pickup_date: pickupDate,
        dropoff_date: dropoffDate,
        client_id: Math.floor(Math.random() * 10) + 1,
        courier_id: courier?.id,
        pricing_id: Math.floor(Math.random() * 9) + 1,
        confirmation_code: confirmationCode,
        status: status,
        notation: notation,
        created_at: new Date(potentialPickupDate.getTime() - 30 * 60 * 1000),
        updated_at: new Date(potentialPickupDate.getTime() - 30 * 60 * 1000),
      });
    }

    await queryInterface.bulkInsert('deliveries', deliveries);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('deliveries', null, {});
  },
};
