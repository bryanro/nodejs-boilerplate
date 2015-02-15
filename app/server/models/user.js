var mongoose = require('mongoose');
var logger = require('winston');
//var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
	password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    lastUpdatedDate: { type: Date, default: Date.now }
});

// CONSTANTS FOR BCRYPT
UserSchema.constants = {};
UserSchema.constants.SALT_WORK_FACTOR = 10;

// Encrypt password before saving if the password has changed
UserSchema.pre('save', function (next) {
    /*var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        logger.debug('Password not modified so next()');
        next();
        return;
    }

    // generate a salt
    logger.debug('Generate salt with salt work factor = ' + UserSchema.constants.SALT_WORK_FACTOR);
    bcrypt.genSalt(UserSchema.constants.SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            logger.error('Error generating salt: ' + err);
            return next(err);
        }

        // hash the password along with our new salt
        logger.debug('Hash the password using the salt', 'UserSchema.pre');
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                logger.error('Error hashing the password using the salt');
                return next(err);
            }
            else {
                logger.debug('Set password to hashed value');
                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            }
        });
    });*/
});

/* METHODS */
UserSchema.methods.authenticate = function (plainText, callback) {
    /*var user = this;
    logger.debug('Entering authenticate()');
    bcrypt.compare(plainText, user.password, function (err, isPasswordMatch) {
        // isPasswordMatch returns true if matches, false if doesn't match
        if (err) {
            logger.error('Error from bcrypt.compare: ' + err);
            callback(false);
        }
        else {
            logger.debug('Successful bcrypt.compare; isPasswordMatch = ' + isPasswordMatch);
            callback(isPasswordMatch);
        }
    });*/
}

mongoose.model('User', UserSchema);

logger.debug('users.js model loaded');