'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('gene2refseq_tax9606', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tax_id: { type: Sequelize.STRING },
      gene_id: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      rna_nucleotide_accession_version: { type: Sequelize.STRING },
      rna_nucleotide_gi: { type: Sequelize.STRING },
      protein_accession_version: { type: Sequelize.STRING },
      protein_gi: { type: Sequelize.STRING },
      genomic_nucleotide_accession_version: { type: Sequelize.STRING },
      genomic_nucleotide_gi: { type: Sequelize.STRING },
      start_position_on_the_genomic_accession: { type: Sequelize.STRING },
      end_position_on_the_genomic_accession: { type: Sequelize.STRING },
      orientation: { type: Sequelize.STRING },
      assembly: { type: Sequelize.STRING },
      mature_peptide_accession_version: { type: Sequelize.STRING },
      mature_peptide_gi: { type: Sequelize.STRING },
      symbol: { type: Sequelize.STRING },
    }).then(() => queryInterface.addIndex('gene2refseq_tax9606', ['tax_id', 'gene_id']));
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
