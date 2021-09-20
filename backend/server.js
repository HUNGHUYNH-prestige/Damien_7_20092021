console.log('--> active file : server.js');

// import http package from Node :
const http = require('http');

// import the app from app.js :
const app = require('./app');

// create a function to verify the type of PORT
function normalizePort (val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
};

// call the function to control the PORT
const port = normalizePort(process.env.PORT || '3000');

// set the port to be used by the app :
app.set('port', port);

// handle the error
function errorHandler (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    switch (error.code) {
        case 'EACCES' :
            console.log(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE' :
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default :
        throw error;
    }
};

// call the method to create a server with from http package :
const server = http.createServer(app);

// controlling the event on the server
// information for server.address()
// ===>> Return Value: This method return the bound address containing the family name, and port of the server.

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on : ' + bind);
});

// server uses listen method :
//server.listen(port, ()=> console.log(`Server is running on port : ${process.env.PORT}`));
server.listen(port);