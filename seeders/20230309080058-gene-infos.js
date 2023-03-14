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

    let geneMap = {};

    let records = geneInfos.data.forEach(record => {
      let {
        "#tax_id": tax_id,
        GeneID: id,
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

      geneMap[id] = {
        id,
        tax_id,
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
      };
    });

    let homologeneFileContent = fs.readFileSync("gene_data/homologene.data").toString();
    let homologeneInfos = Papa.parse(homologeneFileContent);
    let groupMap = {};
    homologeneInfos.data.forEach(h => {
      let groupId = h[0];
      let geneId = h[2];
      if(geneId in geneMap) {
        geneMap[geneId].group_id = groupId;
        geneMap[geneId].protein_id = h[5];
      } else {
        geneMap[geneId] = {
          id: geneId,
          tax_id: h[1],
          group_id: groupId,
          symbol: h[3],
          protein_id: h[5],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      }
    });

    await queryInterface.bulkDelete("gene_infos", null, {
      truncate: true,
      cascade: true,
    });

    return queryInterface.bulkInsert('gene_infos', Object.values(geneMap));
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
