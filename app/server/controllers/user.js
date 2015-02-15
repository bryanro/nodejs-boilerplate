var mongoose = require('mongoose');
var app = module.parent.exports.app;
var UserModel = mongoose.model('User');
var logger = require('winston');
var _ = require('underscore');

var UserController = {};

/* Client Endpoints */

/* CREATE USER */
UserController.createNewUser = function (req, res) {

    logger.debug('Entering createNewUser()');

    var username = req.body.username;
    var password = req.body.password;

    if (typeof username === 'undefined' || typeof password === 'undefined') {
        logger.error('One or more request parameters is undefined: ' + 'username=' + username + ', password=*', 'createNewUser');
        res.status.send({ errorMessage: 'Invalid request' });
        return;
    }

    // check if username already exists
	// use regex for case insenitive
	UserModel.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") } }, function (err, existingUser) {
		if (err) {
			logger.error('Error finding user: ' + err, 'createNewUser');
			// 500 (Internal Server Error)
			res.status(500).send({ errorMessage: err });
		}
		else if (existingUser) {
			logger.info('User already exists in database');
			// 500 (Internal Server Error)
			res.status(400).send({ errorMessage: 'User already exists in database' });
		}
		else {
			logger.debug('Username does not already exist, so create new user');
			var user = new UserModel({ username: username, password: password });
			user.save(function (err, user) {
				if (err) {
					logger.error('Error saving newly created user: ' + err);
					res.status(400).send({ errorMessage: err });
				}
				else {
					logger.debug('Successfully saved user');
					req.session.auth = true;
					req.session.user = user;
					res.status(201).send(user);
				}
			});
		}
	});
}

/* UPDATE USER */
UserController.getAllUsers = function (req, res) {
    logger.debug('Entering getAllUsers()', 'getAllUsers');
    
    UserController.getUserFromSession(req, function (err, user) {
        if (err) {
            if (err === 'Unauthorized') {
                res.status(401).send({ errorMessage: 'Unauthorized' });
            }
            else {
                logger.error('Error getting user');
                res.status(500).send({ errorMessage: err});
            }
        }
        else {
            UserModel.find({}, function (err, users) {
                if (err) {
                    logger.error('Error finding all users: ' + err);
                    res.status(500).({ errorMessage: err });
                }
                else {
                    logger.debug('Successfully found all users');
                    res.status(200).send(users);
                }
            });
        }
    });
}

UserController.changeUsername = function (req, res) {

    logger.debug('Entering changeUsername()');

    var newusername = req.body.newusername;
    var password = req.body.password;

    UserController.getUserFromSession(req, function (err, user) {
        if (err) {
            if (err === 'Unauthorized') {
                res.status(401).send({ errorMessage: 'Unauthorized' });
            }
            else {
                logger.error('Error getting user');
                res.status(500).send({ errorMessage: err });
            }
        }
        else {
            var username = user.username;
            if (typeof password === 'undefined' || typeof newusername === 'undefined') {
                logger.error('One or more request parameters is undefined');
                res.status(400).send({ errorMessage: 'Invalid request data'});
                return;
            }

            logger.debug('User found, authenticate', 'changeUsername', user.username);
            user.authenticate(password, function (passwordMatch) {
                if (!passwordMatch) {
                    logger.warn('Current password does not match; cannot update username');
                    res.status(400).send({ errorMessage: 'Invalid password'});
                }
                else {
                    logger.debug('Authentication successful');

                    // validate that the new username doesn't already exist
                    UserModel.findOne({ username: { $regex: new RegExp("^" + newusername + "$", "i") } }, function (err, newuser) {
                        if (err) {
                            logger.error('Error finding newusername: ' + err);
                            res.status(500).send({ errorMessage: err });
                        }
                        else if (newuser) {
                            logger.warn('New username (' + newusername + ') already exists, so cannot change existing username', 'changeUsername', user.username);
                            res.status(400).send({ errorMessage: 'Username already exists' });
                        }
                        else {
                            user.updateUsername(newusername, function (err, savedUser) {
                                if (err) {
                                    logger.error('Error updating username: ' + err, 'changeUsername', user.username);
                                    res.status(500).send({ errorMessage: err });
                                }
                                else {
                                    logger.debug('Username updated successfully to ' + savedUser.username, 'changeUsername', user.username);
                                    // Need to save session again to account for changed user properties
                                    req.session.user = savedUser;
                                    res.status(200).send(savedUser);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

UserController.changePassword = function (req, res) {

    logger.debug('Entering changePassword()', 'changePassword');

    var currentpassword = req.body.currentpassword;
    var newpassword = req.body.newpassword;

    UserController.getUserFromSession(req, function (err, user) {
        if (err) {
            if (err === 'Unauthorized') {
                res.status(401).send({ errorMessage: 'Unauthorized' });
            }
            else {
                logger.error('Error getting user', 'changePassword');
                res.status(500).send({ errorMessage: err });
            }
        }
        else {
            if (typeof currentpassword === 'undefined' || typeof newpassword === 'undefined') {
                logger.error('One or more request parameters is undefined', 'changePassword', user.username);
                res.status(400).send({ errorMessage: 'Invalid request data' });
                return;
            }

            var username = user.username;
            logger.debug('User found, authenticate', 'changePassword', user.username);
            user.authenticate(currentpassword, function (passwordMatch) {
                if (!passwordMatch) {
                    logger.warn('Current password does not match; cannot update password', 'changePassword', user.username);
                    res.status(400).send({ errorMessage: 'Invalid password' });
                }
                else {
                    user.updatePassword(newpassword, function (err, savedUser) {
                        if (err) {
                            logger.error('Error updating password: ' + err, 'changePassword', user.username);
                            res.status(500).send({ errorMessage: err });
                        }
                        else {
                            logger.debug('Password updated successfully for user', 'changePassword', user.username);
                            // Need to save session again to account for changed user properties
                            req.session.user = savedUser;
                            res.status(200).send(savedUser);
                        }
                    });
                }
            });
        }
    });
}

UserController.updateUser = function (req, res) {
    logger.debug('Entering updateUser()', 'updateUser');

    var newusername = req.body.newusername;
    var newpassword = req.body.newpassword;

    if (!(newusername || newpassword)) {
        logger.error('Error updating user: no update parameters found', 'updateUser');
        res.status(400).send({ errorMessage: 'Error updating user: no update parameters found' });
    }
    else if (newusername && !newpassword) {
        logger.debug('newusername is set', 'updateUser');
        UserController.changeUsername(req, res);
    }
    else if (!newusername && newpassword) {
        logger.debug('newpassword is set', 'updateUser');
        UserController.changePassword(req, res);
    }
    else {
        logger.error('Error updating user: too many updates being made at once, only one allowed', 'updateUser');
        res.status(400).send({ errorMessage: 'Too many updates to user being made at once' });
    }
}

/* QUERY USER */
/* Client-side requests passed through from router */
UserController.getUserInfoFromSession = function (req, res) {

    logger.debug('Entering getUserInfoFromSession()', 'getUserInfoFromSession');

    if (!(req.session && req.session.auth && req.session.user)) {
        logger.error('Unauthorized attempt', 'getUserInfoFromSession');
        res.send(201, 'Unauthorized');
    }
    else {
        var username = req.session.user.username;

        UserModel.findOne({ username: username }, function (err, user) {
            if (err) {
                logger.error('Error finding user: ' + err, 'getUserInfoFromSession', username);
                res.status(500).send({ errorMessage: err });
            }
            else if (!user) {
                logger.error('User not found', 'getUserInfoFromSession', username);
                res.status(400).send({ errorMessage: 'User not found' });
            }
            else {
                logger.debug('User found', 'getUserInfoFromSession', username);
                res.status(200).send(user);
            }
        });
    }

}

UserController.getUserInfoByUsername = function (req, res) {

    logger.debug('Entering getUserInfoByUsername()', 'getUserInfoByUsername');

    var username = req.params.username;

    if (typeof username === 'undefined') {
        logger.error('username parameter is undefined', 'getUserInfoByUsername');
        res.status(400).send({ errorMessage: 'Invalid request' });
        return;
    }

    UserModel.findOne({ username: username }, function (err, user) {
        if (err) {
            logger.error('Error finding user: ' + err, 'getUserInfoByUsername', username);
            res.status(500).send({ errorMessage: err });
        }
        else if (!user) {
            logger.error('User not found', 'getUserInfoByUsername', username);
            res.status(400).send({ errorMessage: 'User not found' });
        }
        else {
            logger.debug('User found', 'getUserInfoByUsername', username);
            res.status(200).send(user);
        }
    });
}

UserController.getUserInfoById = function (req, res) {
    logger.debug('Entering getUserInfoById()', 'getUserInfoById');

    var userId = req.params.id;

    UserModel.findById(userId, function (err, user) {
        if (err) {
            logger.error('Error finding user: ' + err, 'getUserInfo');
            res.status(500).send({ erorrMessage: err });
        }
        else if (!user) {
            logger.error('User not found', 'getUserInfo');
            res.status(400).send({ errorMessage: 'User not found' });
        }
        else {
            logger.debug('User found', 'getUserInfo', user.username);
            res.status(200).send(user);
        }
    });
}

/* Server-side requests with a callback */
UserController.getUserFromSession = function (req, callback) {
    if (!(req.session && req.session.auth && req.session.user)) {
        logger.error('Unauthorized attempt', 'getUserFromSession');
        callback('Unauthorized');
    }
    else {
        var username = req.session.user.username;

        UserModel.findOne({ username: username }, function (err, user) {
            if (err) {
                logger.error('Error finding user: ' + err, 'getUserFromSession', username);
                callback(err);
            }
            else if (!user) {
                logger.error('User not found', 'getUserFromSession', username);
                callback('User not found');
            }
            else {
                logger.debug('User found', 'getUserFromSession', username);
                callback(null, user);
            }
        });
    }
}

module.exports = UserController;

logger.debug('user.js controller loaded');