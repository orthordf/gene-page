'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Species extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Species.init(
    {
      scientific_name: DataTypes.STRING,
      common_name: DataTypes.STRING
    },
    {
      sequelize,
      tableName: 'species',
      modelName: 'Species',

      name: {
        singular: 'Species',
        plural: 'Species'
      }
    }
  );
  return Species;
};
