'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable('gene2refseqs', {
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
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() => queryInterface.addIndex('gene2refseqs', ['tax_id']))
      .then(() => queryInterface.addIndex('gene2refseqs', ['gene_id']));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gene2refseqs');
  }
};
