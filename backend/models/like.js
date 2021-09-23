'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /* remember that :
      User hasMany Post, Comment, Like
      Post hasMany Comment, Like
      */
      /*
      The Like.belongsTo(User) association means
      that a One-To-One relationship exists between Like and User,
      with the foreign key being defined in the source model (Like)
      --- --- --- same meaning with Post --- --- ---
      */
      models.Like.belongsTo(models.User, {
        onDelete: 'cascade'
      })

      models.Like.belongsTo(models.Post, {
        onDelete: 'cascade'
      })
    }
  };
  Like.init({
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        isInt: true,
        notEmpty: true
      }
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        isInt: true,
        notEmpty: true
      }
    },
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};