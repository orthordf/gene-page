'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      // Add column after tax_id
      .addColumn('gene_infos', 'homologene_tax_id', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'tax_id' // 'after' only works for MySQL
      })
      .then(() => queryInterface.addIndex('gene_infos', ['homologene_tax_id']));

    // Copy value of tax_id to homologene_tax_id
    await queryInterface.sequelize.query(`
        UPDATE gene_infos
        SET homologene_tax_id = tax_id
        WHERE tax_id IS NOT NULL
      `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('gene_infos', 'homologene_tax_id');
  }
};
