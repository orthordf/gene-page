'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gene2RefSeqTax9606 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Gene2RefSeqTax9606.init(
    {
      gene_id: DataTypes.STRING,
      rna_nucleotide_accession_version: DataTypes.STRING,
      protein_accession_version: DataTypes.STRING,
      status: DataTypes.STRING
    },
    {
      sequelize,
      tableName: 'gene2refseq_tax9606',
      modelName: 'Gene2RefSeqTax9606',
      timestamps: false
    }
  );
  return Gene2RefSeqTax9606;
};
