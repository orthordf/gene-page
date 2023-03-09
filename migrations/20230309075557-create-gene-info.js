'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gene_infos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tax_id: {
        type: Sequelize.STRING
      },
      gene_id: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.STRING
      },
      locus_tag: {
        type: Sequelize.STRING
      },
      synonyms: {
        type: Sequelize.STRING
      },
      dbXrefs: {
        type: Sequelize.STRING
      },
      chromosome: {
        type: Sequelize.STRING
      },
      map_location: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      type_of_gene: {
        type: Sequelize.STRING
      },
      symbol_from_nomenclature_authority: {
        type: Sequelize.STRING
      },
      full_name_from_nomenclature_authority: {
        type: Sequelize.STRING
      },
      nomenclature_status: {
        type: Sequelize.STRING
      },
      other_designations: {
        type: Sequelize.STRING
      },
      modification_date: {
        type: Sequelize.STRING
      },
      feature_type: {
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
    }).then(() => queryInterface.addIndex('gene_infos', ['tax_id']))
      .then(() => queryInterface.addIndex('gene_infos', ['gene_id']));
},
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gene_infos');
  }
};