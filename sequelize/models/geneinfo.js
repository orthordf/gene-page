'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GeneInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.HomologeneSpecies, {
        foreignKey: 'homologene_tax_id'
      });
    }
  }
  GeneInfo.init(
    {
      tax_id: DataTypes.STRING,
      group_id: DataTypes.STRING,
      protein_id: DataTypes.STRING,
      symbol: DataTypes.STRING,
      locus_tag: DataTypes.STRING,
      synonyms: DataTypes.STRING,
      dbXrefs: DataTypes.STRING,
      chromosome: DataTypes.STRING,
      map_location: DataTypes.STRING,
      description: DataTypes.STRING,
      type_of_gene: DataTypes.STRING,
      symbol_from_nomenclature_authority: DataTypes.STRING,
      full_name_from_nomenclature_authority: DataTypes.STRING,
      nomenclature_status: DataTypes.STRING,
      other_designations: DataTypes.STRING,
      modification_date: DataTypes.STRING,
      feature_type: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'GeneInfo',
      tableName: 'gene_infos',
      timestamps: false
    }
  );

  return GeneInfo;
};
