const dotenv = require('dotenv');
//dotenv.config();
//console.log(dotenv.config());
console.log('--> active file : config.js')


module.exports= {

  development: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT
  },

  test: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT
  },

  production: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT
  }

}