module.exports = {
    development: {
        mongoConn: 'mongodb://localhost/boilerplate', //TODO: CHANGE THIS VALUE
        verbosityLevel: 'debug',
        sessionExpiration: 86400000 * 30    // 30 days
    },
    beta: {
        mongoConn: process.env.OPENSHIFT_MONGODB_DB_URL + 'boilerplate', //TODO: CHANGE THIS VALUE
        verbosityLevel: 'debug',
        sessionExpiration: 86400000 * 10    // 10 days
    },
    production: {
        mongoConn: process.env.OPENSHIFT_MONGODB_DB_URL + 'boilerplate', //TODO: CHANGE THIS VALUE
        verbosityLevel: 'warn',
        sessionExpiration: 86400000 * 10    // 10 days
    }
}