'use strict';

const { random } = Math;
const { getRandomParisCoordinates } = require('./scripts/getRandomCoordinates');

module.exports = {
  async up(queryInterface) {
    const deliveries = [];
    const statusOptions = ['pending', 'picked_up', 'delivered', 'cancelled'];
    const couriers = await queryInterface.sequelize.query(`SELECT id, status FROM couriers;`);
    let notAssignedOnDeliveryCouriers = couriers[0].filter(courier => courier.status === 'on_delivery');
    for (let i = 1; i <= 200; i++) {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const differenceInTime = now.getTime() - threeMonthsAgo.getTime();

      const randomTimeBetweenNowAndThreeMonthsAgo = threeMonthsAgo.getTime() + random() * differenceInTime;
      const pickupDate = new Date(randomTimeBetweenNowAndThreeMonthsAgo);

      const dropoffDate = new Date(pickupDate.getTime() + 15 * 60 * 1000 + random() * (2 * 60 * 60 * 1000 - 15 * 60 * 1000)); // Entre 15 minutes et 2 heures

      const confirmationCode = `${Math.floor(1000 + random() * 9000)}`; // Code à 4 chiffres

      const pickupCoordinates = getRandomParisCoordinates();
      const dropoffCoordinates = getRandomParisCoordinates();

      let status = statusOptions[i % statusOptions.length];
      let courier;
      if ((status === 'pending' || status === 'picked_up') && !notAssignedOnDeliveryCouriers.length) {
        status = ['delivered', 'cancelled'][Math.floor(Math.random() * 2)];
        console.log('No more couriers available for delivery, changing status to', status);
      }
      if (status === 'pending' || status === 'picked_up') {
        courier = notAssignedOnDeliveryCouriers[Math.floor(Math.random() * notAssignedOnDeliveryCouriers.length)];
        notAssignedOnDeliveryCouriers = notAssignedOnDeliveryCouriers.filter(notAssignedCourier => notAssignedCourier.id !== courier.id);
      } else {
        const otherCouriers = couriers[0].filter(courier => courier.status === 'available' || courier.status === 'unavailable');
        courier = otherCouriers[Math.floor(Math.random() * otherCouriers.length)];
      }

      deliveries.push({
        pickup_latitude: pickupCoordinates.latitude,
        pickup_longitude: pickupCoordinates.longitude,
        dropoff_latitude: dropoffCoordinates.latitude,
        dropoff_longitude: dropoffCoordinates.longitude,
        pickup_date: pickupDate,
        dropoff_date: dropoffDate,
        client_id: Math.floor(Math.random() * 10) + 1,
        courier_id: courier.id,
        confirmation_code: confirmationCode,
        status: status,
        notation: Math.floor(Math.random() * 5) + 1,
        created_at: new Date(pickupDate.getTime() - 30 * 60 * 1000),
        updated_at: new Date(pickupDate.getTime() - 30 * 60 * 1000),
      });
    }

    await queryInterface.bulkInsert('deliveries', deliveries);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('deliveries', null, {});
  },
};
