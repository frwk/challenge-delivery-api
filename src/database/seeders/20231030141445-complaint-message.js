'use strict';

const USER_MESSAGE = "Hello, I'm having a problem with my delivery";
const AGENT_MESSAGE = "Hello, I'm an agent and I'll help you with your problem";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const complaintMessages = [];
    const complaints = await queryInterface.sequelize.query(`SELECT id FROM complaints;`);
    const complaintIds = complaints[0].map(complaint => complaint.id);
    const users = await queryInterface.sequelize.query(`SELECT id, role FROM users;`);
    const adminUserId = users[0].find(user => user.role === 'admin').id;
    const usersIds = users[0].map(user => user.id);
    for (let i = 1; i <= 10; i++) {
      const randomUserId = usersIds[Math.floor(Math.random() * usersIds.length)];
      usersIds.splice(usersIds.indexOf(randomUserId), 1);

      const randomComplaintId = complaintIds[Math.floor(Math.random() * complaintIds.length)];
      complaintIds.splice(complaintIds.indexOf(randomComplaintId), 1);

      complaintMessages.push({
        complaint_id: randomComplaintId,
        user_id: randomUserId,
        content: USER_MESSAGE,
        created_at: new Date(),
        updated_at: new Date(),
      });

      complaintMessages.push({
        complaint_id: randomComplaintId,
        user_id: adminUserId,
        content: AGENT_MESSAGE,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('complaint_messages', complaintMessages);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('complaint_messages', null, {});
  },
};
