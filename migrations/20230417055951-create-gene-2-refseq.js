'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gene2refseqs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gene_id: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.STRING
      },
      protein_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('gene2refseqs', ['protein_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gene2refseqs');
  }
};
