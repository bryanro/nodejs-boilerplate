﻿var logger = require('./modules/logger');

module.exports = function (app) {

    // Export the app so it can be used by the controllers
    module.exports.app = app;

    // Test
    app.get('/test', function (req, res) {
        res.send('API is running');
    });

    // HTML Pages
    app.get('/', function (req, res) {
        res.sendfile('./app/www/index.html');
    });

    app.post('/logout', function (req, res) {
        req.session.destroy();
		res.send(200, 'Session destroyed');
    });

    // Options for CORS
    app.options('/*', function (req, res) {
        res.send(200);
    });

	// Login
    var login = require('./controllers/login');
    app.post('/login', login.login);
	
	// User
    var user = require('./controllers/user');
	app.get('/user', user.getUserInfoFromSession);
	app.post('/user', user.createNewUser);
	app.put('/user/:id', user.updateUser);
	app.get('/users', user.getAllUsers);

    logger.info('Finished setting up routes', 'routes.js');
}