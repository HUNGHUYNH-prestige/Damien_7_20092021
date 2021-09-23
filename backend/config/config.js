const dotenv = require('dotenv');
//dotenv.config();
//console.log(dotenv.config());
const fs = require('fs');

// check
console.log('--> active file : config.js in config')


module.exports= {

  development: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host:     process.env.HOST,
    dialect:  process.env.DIALECT
  },

  test: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host:     process.env.HOST,
    dialect:  process.env.DIALECT
  },

  production: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host:     process.env.HOST,
    dialect:  process.env.DIALECT
  }

}