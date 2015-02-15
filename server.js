#!/bin/env node

var express = require('express')
    , http = require('http')
    , env = process.env.NODE_ENV || 'development' // Load environment based configuration
    , config = require('./config')[env]
    , logger = require('winston');

var app = express();

app.config = config;

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    logger.info('Express server listening on port ' + server.address().port);
});

require('./app/express-settings')(app);
require('./app/server/express-routes')(app);
require('./app/server/express-db')(app);

module.exports = app;