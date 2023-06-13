'use strict';

const fs = require('fs');
const Papa = require('papaparse');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let fileContent = fs.readFileSync('gene_data/gene2refseq_tax9606').toString();
    let gene2RefSeqInfo = Papa.parse(fileContent, {
      header: true
    });

    let records = gene2RefSeqInfo.data.map((record) => {
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

    await queryInterface.bulkDelete('gene2refseq_tax9606', null, {
      truncate: true,
      cascade: true
    });

    return queryInterface.bulkInsert('gene2refseq_tax9606', records);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
