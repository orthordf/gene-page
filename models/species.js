'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Species extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Species.init({
    sp_order: DataTypes.INTEGER,
    scientific_name: DataTypes.STRING,
    common_name: DataTypes.STRING,
    comment: DataTypes.STRING,
    time_tree_mya: DataTypes.STRING,
    genome_id: DataTypes.STRING,
    genome_release: DataTypes.STRING,
    genome_date: DataTypes.STRING,
    annotation_release:   DataTypes.STRING,
    annotation_date: DataTypes.STRING,
    input_genes: DataTypes.STRING,
    grouped_genes: DataTypes.STRING,
    groups: DataTypes.STRING,
    wikidata_url: DataTypes.STRING,
    wikidata_thumbnail_url: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'species',
    modelName: 'Species',
  });
  return Species;
};