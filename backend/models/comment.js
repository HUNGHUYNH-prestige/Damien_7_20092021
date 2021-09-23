'use strict';
const { model } = require('mongoose');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      /*
      The Comment.belongsTo(User) association means
      that a One-To-One relationship exists between Comment and User,
      with the foreign key being defined in the source model (Comment)
      --- --- --- same meaning with Post --- --- ---
      */
      /* remember that :
      User hasMany Post, Comment, Like
      Post hasMany Comment, Like
      */

      models.Comment.belongsTo(models.User, {
        onDelete: 'cascade'
      })

      models.Comment.belongsTo(models.Post, {
        onDelete: 'cascade'
      })
    }
  };
  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
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
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};