'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gene2RefSeq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.GeneInfo, {
        foreignKey: 'gene_id'
      });
    }
  }
  Gene2RefSeq.init(
    {
      gene_id: DataTypes.STRING,
      symbol: DataTypes.STRING,
      rna_nucleotide_accession_version: DataTypes.STRING,
      protein_accession_version: DataTypes.STRING,
      status: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Gene2RefSeq',
      tableName: 'gene2refseqs',
      timestamps: false
    }
  );
  return Gene2RefSeq;
};
