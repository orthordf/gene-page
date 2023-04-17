'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add index to protein_id in gene_infos
    await queryInterface.addIndex('gene_infos', ['protein_id']);
  },

  async down (queryInterface, Sequelize) {
    // Remove index from protein_id in gene_infos
    await queryInterface.removeIndex('gene_infos', ['protein_id']);
  }
};
