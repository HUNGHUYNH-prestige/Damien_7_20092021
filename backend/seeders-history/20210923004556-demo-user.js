'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    return queryInterface.bulkInsert('Users', [{
      firstName: 'demo',
      lastName: 'user',
      email: 'demouser@gmail.com',
      password: 'Demo123user',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // command : npx sequelize-cli db:seed:all
    // all seeds will go inside table
    // all data from seeds will be added to the table of MySQL
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
   
    return queryInterface.bulkDelete('Users', null, {});

    // command : npx sequelize-cli db:seed:undo:all
    // all seeds will be removed from table
    // all data from seeds will be deleted in the table of MySQL
  }
};
