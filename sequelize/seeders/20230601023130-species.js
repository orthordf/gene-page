'use strict';

const fs = require('fs');
const Papa = require('papaparse');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let fileContent = fs.readFileSync('gene_data/species.tsv').toString();
    let speciesRecords = Papa.parse(fileContent, {
      header: true
    });

    let records = speciesRecords.data
      .filter((s) => s['Taxonomy ID'])
      .map((record, i) => {
        let { 'Taxonomy ID': id, 'Scientific name': scientific_name, 'Common name': common_name } = record;

        return {
          id,
          scientific_name,
          common_name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sp_order: i + 1
        };
      });

    await queryInterface.bulkDelete('species', null, {
      truncate: true,
      cascade: true
    });

    return queryInterface.bulkInsert('species', records);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('species');
  }
};
