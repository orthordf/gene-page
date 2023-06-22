'use strict';
const fs = require('fs');
const Papa = require('papaparse');
const readline = require('readline');
/** @type {import('sequelize-cli').Migration} */

async function insertGeneTSV(queryInterface, tsv) {
  let geneInfos = Papa.parse(tsv, {
    header: true,
    delimiter: '\t'
  });

  let records = geneInfos.data.map((record) => {
    let {
      '#tax_id': tax_id,
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

    return {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
  queryInterface.bulkInsert('gene_infos', records, {
    // ignoreDuplicates: true
  });
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('gene_infos', null, {
        truncate: true,
        cascade: true
      });

      const fileStream = fs.createReadStream('gene_data/gene_info');
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      let fileContent = '';
      let headerLine = null;

      for await (const line of rl) {
        if (headerLine === null) {
          headerLine = line + '\n';
          continue;
        } else {
          fileContent += line + '\n';
        }

        if (fileContent.length >= 1e6) {
          insertGeneTSV(queryInterface, headerLine + fileContent.trimEnd());
          fileContent = '';
        }
      }

      insertGeneTSV(queryInterface, headerLine + fileContent.trimEnd());

      let homologeneFileContent = fs.readFileSync('gene_data/homologene.data').toString();
      let homologeneInfos = Papa.parse(homologeneFileContent);
      let homologeneRecords = homologeneInfos.data.map((h) => {
        let groupId = h[0];
        let geneId = h[2];
        return {
          id: geneId,
          tax_id: h[1],
          homologene_tax_id: h[1],
          group_id: groupId,
          symbol: h[3],
          protein_id: h[5],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
      });

      await queryInterface.bulkInsert('gene_infos', homologeneRecords, {
        upsertKeys: ['id'],
        updateOnDuplicate: ['homologene_tax_id', 'group_id', 'protein_id']
      });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  },

  async down(queryInterface, Sequelize) {}
};
