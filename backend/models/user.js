'use strict';
const { model } = require('mongoose');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /* step 1 :
      The User.hasMany(Post) association means
      that a One-To-Many relationship exists between User and Post,
      with the foreign key being defined in the target model (Post)
      --- --- --- same meaning with Comment and Like --- --- ---
      */
      /* step 2 :
      To create a One-To-Many relationship,
      the hasMany and belongsTo associations are used together
      */
      models.User.hasMany(models.Post);
      models.User.hasMany(models.Comment);
      models.User.hasMany(models.Like);
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zàâçéèêëîïôûùüÿñæœ .-]*$/i,
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zàâçéèêëîïôûùüÿñæœ .-]*$/i,
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    profilePicture: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};