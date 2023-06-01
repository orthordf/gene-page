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


    fileContent = fs.readFileSync("gene_data/wikidata_images.tsv").toString();
    let wikidataRecords = Papa.parse(fileContent, {
      header: true
    });

    let wikidataMap = {};
    wikidataRecords.data.filter(r => r.taxid).forEach(record => {
      wikidataMap[record.taxid] = {
        url: record.url,
        thumbnail_url: record.thumb
      };
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

      let wikidataEntry = wikidataMap[id]

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
        wikidata_url: wikidataEntry?.url,
        wikidata_thumbnail_url: wikidataEntry?.thumbnail_url,
        createdAt: (new Date()).toISOString(),
        updatedAt: (new Date()).toISOString()
      }
    });

    await queryInterface.bulkDelete("homologene_species", null, {
      truncate: true,
      cascade: true,
    });

    return queryInterface.bulkInsert('homologene_species', records);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('homologene_species');
  }
};
