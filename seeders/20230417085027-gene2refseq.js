'use strict';

const fs = require('fs');
const Papa = require('papaparse');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let fileContent = fs.readFileSync('gene_data/gene2refseq').toString();
    let gene2refseqs = Papa.parse(fileContent, {
      header: false
    });

    let records = gene2refseqs.data.map((record) => {
      return {
        gene_id: record[1],
        symbol: record[2],
        protein_id: record[3],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    await queryInterface.bulkDelete('gene2refseqs', null, {
      truncate: true,
      cascade: true
    });

    // show error when bulkInsert failed
    return queryInterface.bulkInsert('gene2refseqs', records).catch((err) => {
      console.error(err);
    });
  },

  async down(queryInterface, Sequelize) {}
};
