var test = require('./routes/test');

module.exports = function (app) {
    app.use('/test', test);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
};
