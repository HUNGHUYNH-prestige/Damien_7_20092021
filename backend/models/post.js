'use strict';
const {
  Model, BelongsTo
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.hasMany(models.Comment);
      models.Post.hasMany(models.Like);
      
      /* step 1 :
      The Post.hasMany(Comment) association means
      that a One-To-Many relationship exists between Post and Comment,
      with the foreign key being defined in the target model (Comment)
      --- --- --- same meaning with Like --- --- ---
      */
      /* step 2 :
      To create a One-To-Many relationship,
      the hasMany and belongsTo associations are used together
      */
      /* step 3 :
      The Post.belongsTo(User) association means
      that a One-To-One relationship exists between Post and User,
      with the foreign key being defined in the source model (Post).
      */

      models.Post.belongsTo(models.User, {
        onDelete: 'cascade'
      });
    }
  };
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    media: {
      type: DataTypes.STRING,
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
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};