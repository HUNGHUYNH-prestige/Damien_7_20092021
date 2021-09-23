### GROUPOMANIA

GROUPOMANIA is a socialnetwork for internal personnal.

# groupomania frontend

## Project setup
```
Before starting anything, use the command line to do :
cd groupomania
You may need to do cd until you reach the right folder
```

```
npm install in folder name : groupomania
```

```
npm run serve => in the command line in order to run the server for vue
```

```
Then go to => localhost:8080
Follow the localhost displayed information in your command line
```

# groupomania backend

## Introduction

```
Node.js (Server) + MySQL (DataBase) supports user registration
Login with JSONWEBTOKEN : JWT authentication
```

```
The API is written in JavaScript for Node.js
and requires MySQL to be running.

The Sequelize ORM is used to connect to MySQL,
define the database schema and read/write data,
and Express (framework) is used as the web server for the API.
```

## Project setup
```
Before starting anything, please take a look at the .env-model file
In this file, you need to fill up some data
Then, once this is done
Rename the .env-model file into .env
Please make sure you have done this : npm install dotenv --save
to use dotenv package
```
```
Then, do this :
npm install from the command line
in the backend folder ( use cd to move)
where the package.json is located
```
```
Finally : to run the API
Start the API by running : npm start or npm run nodemon
from the command line
You should have a message like that : Server is running on port 3000
```
```
In the command line in the backend folder :
Install sequelize-cli to manage models and migrations
npm install -g sequelize-cli
DATABASE CREATION with :
npx sequelize db:create
MIGRATIONS with :
npx sequelize db:migrate
If help is needed do :
npx sequelize --help
```