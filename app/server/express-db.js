var mongoose = require('mongoose');
var logger = require('winston');

module.exports = function (app) {
    mongoose.connect(app.config.mongoConnection, function(err) {
        if (err){
            logger.error('Error connecting to mongoose database (' + app.config.mongoConnection + '): ' + err);
        }
        else {
            logger.info('Successfully connected to mongoose');
        }
    });
}