'use strict';

const fs = require("fs");
const Papa = require("papaparse");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let fileContent = fs.readFileSync("gene_data/homologene_species.tsv").toString();
    let speciesRecords = Papa.parse(fileContent, {
      header: true
    });

    let records = speciesRecords.data.filter(r => r.No).map(record => {
      let {
        "No": sp_order,
        "Taxonomy ID": id,
        "Scientific name": scientific_name,
        "Common name": common_name,
        comment,
        "TimeTree (mya)": time_tree_mya,
        "Genome ID": genome_id,
        "Genome release": genome_release,
        "Genome date": genome_date,
        "Annotation release": annotation_release,
        "Annotation date": annotation_date,
        "Input genes": input_genes,
        "Grouped genes": grouped_genes,
        "Groups": groups
      } = record;

      return {
        id,
        sp_order,
        scientific_name,
        common_name,
        comment,
        time_tree_mya,
        genome_id,
        genome_release,
        genome_date,
        annotation_release,
        annotation_date,
        input_genes,
        grouped_genes,
        groups,
        createdAt: (new Date()).toISOString(),
        updatedAt: (new Date()).toISOString()
      }
    });

    await queryInterface.bulkDelete("species", null, {
      truncate: true,
      cascade: true,
    });

    return queryInterface.bulkInsert('species', records);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('species');
  }
};
