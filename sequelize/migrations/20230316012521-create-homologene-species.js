'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('homologene_species', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sp_order: {
        type: Sequelize.INTEGER
      },
      scientific_name: {
        type: Sequelize.STRING
      },
      common_name: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      },
      time_tree_mya: {
        type: Sequelize.STRING
      },
      genome_id: {
        type: Sequelize.STRING
      },
      genome_release: {
        type: Sequelize.STRING
      },
      genome_date: {
        type: Sequelize.DATE
      },
      annotation_release: {
        type: Sequelize.STRING
      },
      annotation_date: {
        type: Sequelize.DATE
      },
      input_genes: {
        type: Sequelize.STRING
      },
      grouped_genes: {
        type: Sequelize.STRING
      },
      groups: {
        type: Sequelize.STRING
      },
      wikidata_url: {
        type: Sequelize.STRING
      },
      wikidata_thumbnail_url: {
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('homologene_species');
  }
};
