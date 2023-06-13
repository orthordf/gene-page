'use strict';

const fs = require('fs');
const Papa = require('papaparse');
const readline = require('readline');
/** @type {import('sequelize-cli').Migration} */

async function insertGene2RefseqTSV(queryInterface, tsv) {
  let gene2refseqs = Papa.parse(tsv, {
    header: true,
    delimiter: '\t'
  });

  let records = gene2refseqs.data.map((record) => {
    let {
      '#tax_id': tax_id,
      GeneID: gene_id,
      status,
      'RNA_nucleotide_accession.version': rna_nucleotide_accession_version,
      RNA_nucleotide_gi: rna_nucleotide_gi,
      'protein_accession.version': protein_accession_version,
      protein_gi,
      'genomic_nucleotide_accession.version': genomic_nucleotide_accession_version,
      genomic_nucleotide_gi,
      start_position_on_the_genomic_accession,
      end_position_on_the_genomic_accession,
      orientation,
      assembly,
      'mature_peptide_accession.version': mature_peptide_accession_version,
      mature_peptide_gi,
      Symbol: symbol
    } = record;

    return {
      tax_id,
      gene_id,
      status,
      rna_nucleotide_accession_version,
      rna_nucleotide_gi,
      protein_accession_version,
      protein_gi,
      genomic_nucleotide_accession_version,
      genomic_nucleotide_gi,
      start_position_on_the_genomic_accession,
      end_position_on_the_genomic_accession,
      orientation,
      assembly,
      mature_peptide_accession_version,
      mature_peptide_gi,
      symbol,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  });

  return queryInterface.bulkInsert('gene2refseqs', records).catch((err) => {
    console.error(err);
  });
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gene2refseqs', null, {
      truncate: true,
      cascade: true
    });

    const fileStream = fs.createReadStream('gene_data/gene2refseqs');
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
        await insertGene2RefseqTSV(queryInterface, headerLine + fileContent.trimEnd());
        fileContent = '';
      }
    }

    await insertGene2RefseqTSV(queryInterface, headerLine + fileContent.trimEnd());
  },

  async down(queryInterface, Sequelize) {}
};
