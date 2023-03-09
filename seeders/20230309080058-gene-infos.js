'use strict';

const fs = require("fs");
const Papa = require("papaparse");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let fileContent = fs.readFileSync("gene_data/gene_info_tax9606.2022-09-30").toString();
    let geneInfos = Papa.parse(fileContent, {
      header: true
    });

    let records = geneInfos.data.map(record => {
      let {
        "#tax_id": tax_id,
        GeneID: gene_id,
        Symbol: symbol,
        LocusTag: locus_tag,
        Synonyms: synonyms,
        dbXrefs: dbxrefs,
        chromosome,
        map_location,
        description,
        type_of_gene,
        Symbol_from_nomenclature_authority: symbol_from_nomenclature_authority,
        Full_name_from_nomenclature_authority: full_name_from_nomenclature_authority,
        Nomenclature_status: nomenclature_status,
        Other_designations: other_designations,
        Modification_date: modification_date,
        Feature_type: feature_type
      } = record;

      return {
        tax_id,
        gene_id,
        symbol,
        locus_tag,
        synonyms,
        dbxrefs,
        chromosome,
        map_location,
        description,
        type_of_gene,
        symbol_from_nomenclature_authority,
        full_name_from_nomenclature_authority,
        nomenclature_status,
        other_designations,
        modification_date,
        feature_type,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    });

    return queryInterface.bulkInsert('gene_infos', records);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
