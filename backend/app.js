console.log('--> active file : app.js');

// - - - File description :
// app.js is a file for a program
// this program is the application

// - - - IMPORT - - -

const express = require('express');


// dotenv for environment protection
const dotenv = require('dotenv');
console.log('solution 1 to get the dotenv data :');
console.log(dotenv.config());

const dotenvresult = dotenv.config();
console.log('solution 2 to get the dotenv data :')
console.log(dotenvresult);

// helmet : http headers security in Express
const helmet = require('helmet');
// path : improve in path for access
const path = require('path');
// cache protection : this Express middleware sets some HTTP response headers to try to disable client-side caching
const nocache = require("nocache");
// - - - import morgan for monitoring the http request
const morgan = require('morgan');
// cookie-session : middleware for storing the session data on the client within a cookie
const cookieSession = require('cookie-session');


// file system : access the file in the system
const fs = require('fs');

/* MySQL -- -- -- DATABASE -- -- -- Connexion */

const db = require('./models');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, 'root', process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT
});

try {
  // authenticate
  db.sequelize.authenticate();
  console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

try {
  // synchronize models into tables in MySQL : table creation
  db.sequelize.sync();
  console.log('Synchronization is ok');

  } catch (error) {
    console.error('This is the error:', error);
  }

// do migrations with command npx sequelize db:migrate
// do create database with command npx sequelize db:create


// --- --- --- --- ---
/*
const mysql = require('mysql2/promise');
const { setUncaughtExceptionCaptureCallback } = require('process');

try {
  initialize();
  console.log('init is ok');
} catch (error) {
  console.error('init is not ok:', error);
}

async function initialize() {
  // create db for database if it does not exist yet
  const connection = await mysql.createConnection({ host : process.env.HOST, port : process.env.PORT, user : process.env.USERNAME, password : process.env.PASSWORD });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

  // init model and add them to the exported db object
  db.User = require('../users/user.model')(sequelize);

  // sync all models with database
  await sequelize.sync();
}
*/
// --- --- --- --- ---



// - - - ROUTES - - -
// const sauceRoutes = require('./routes/sauce');
// example -- -- -- here -- -- -- example
// ROUTES for API REST
// app.use('/api/sauces', sauceRoutes);



// app call the express method to create an express application :
const app = express();

   
// middleware for headers (CORS) for all requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// cookie client side
const uneHeure = 1 * 1000 * 60 * 60;
console.log(uneHeure + ' ms = 1 heure');
const expiryDate = new Date(Date.now() + uneHeure);

app.use(cookieSession({
    name : 'session',
    secret : process.env.COOKIE,
    cookie : {
        secure : true,
        httpOnly : true,
        domain : 'http://localhost:3000',
        expire : expiryDate
    }
}));

// use helmet to protect http headers -> protection and hide X-Powered-By : Express
app.use(helmet());

// turning off caching with
app.use(nocache());


app.use(morgan('tiny'));
// tiny => the minimal output => :method :url :status :res[content-length] - :response-time ms

// depreciated
// body parser = expess.json()
// use it before the post request
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// multer : file manager and path direction
app.use('/images', express.static(path.join(__dirname, 'images')));

// ROUTES for API REST
//app.use('/api/sauces', sauceRoutes);

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// testing the API on localhost port 3000
// testing get
app.get('/', (req, res, next) => {
    //res.json('ok');
    
    res.json({
      name: 'Get',
      message: 'Get is ok'
    });
    console.log('GET is ok');
    
});
// testing post
app.post('/', (req, res, next) => {
  res.json({
    name: 'Post',
    message: 'Post is ok'
  });
  console.log('POST is ok');
});
// testing put
app.post('/', (req, res, next) => {
  res.json({
    name: 'Put',
    message: 'Put is ok'
  });
  console.log('PUT is ok');
})


// export the module app
module.exports = app;