const app = require('../../express');
var unirest = require('unirest');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../../public/uploads/user/profile'});

var userModel = require('../models/user/user.model.server');

var bcrypt = require("bcrypt-nodejs");

const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

var facebookConfig = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'last_name', 'first_name', 'email']
};

var googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
};

passport.use(new LocalStrategy(localStrategy));
passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
passport.use(new GoogleStrategy(googleConfig, googleStrategy));

// :userId: path params
app.get('/api/user/:userId', findUserById);
app.get('/api/user/findme', findMe);
app.get('/api/userpop/:userId', popUserById);
app.get('/api/checkname', findUserByName);
app.get('/api/user', isAdmin, findAllUsers);
app.get("/api/user/username/partial/:username", findUserByPartialUsername);


app.post('/api/user', isAdmin, createUser);
// TODO:changed the updateUser, without check isAdmin
app.put('/api/user/:userId', isAdmin, updateUser);

app.delete('/api/user/:userId', isAdmin, deleteUser);

app.post('/api/login', passport.authenticate('local'), login);
app.get('/api/loggedin', loggedin);
app.post('/api/logout', logout);
app.post('/api/register', register);
app.get('/api/checkAdmin', checkAdmin);
app.delete('/api/unregister', unregister);
app.put('/api/update', updateProfile);

app.post('/api/upload', upload.single('myFile'), uploadImage);

app.get('/api/follow/:followingId', follow);
app.get('/api/unfollow/:followingId', unfollow);

app.get('/api/addLikedRecipe/:rId', addLikedRecipe);
app.delete('/api/deleteLikedRecipe/:rId', deleteLikedRecipe);

app.put('/api/message/:userId', sendMessage);
app.get('/api/user/populate/:arrName/:userId', populateArr);
app.get('/api/renderInMessage', renderInMessage);
app.get('/api/renderOutMessage', renderOutMessage);

app.post('/api/account/bmiCal', bmiCal);


app.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']}));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/index.html#!/profile',
        failureRedirect: '/index.html#!/login'
    }));

app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/index.html#!/profile',
    failureRedirect: '/index.html#!/login'
}));

passport.isAdmin = isAdmin;
passport.isMerchant = isMerchant;
passport.isRecipePro = isRecipePro;


module.exports = passport;

function isRecipePro(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'RECIPEPRO') {
        next();
    } else {
        res.sendStatus(401);
    }
}


function isMerchant(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'MERCHANT') {
        next();
    } else {
        res.sendStatus(401);
    }
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        next();
    } else {
        res.sendStatus(401);
    }
}


//////////actural function/////////////////

function findMe(req, res) {
    userModel
        .findUserById(req.user._id)
        .then(function (user) {
            res.json(user);
        })
}

function findUserByName(req, res) {
    userModel
        .findUserByUsername(req.query.username)
        .then(function (user) {
            if (user) {
                res.json(user)
            } else {
            }
            res.sendStatus(404);
        })
}

function unregister(req, res) {
    userModel
        .deleteUser(req.user._id)
        .then(function (user) {
            req.logout();
            res.sendStatus(200);
        })
}

function register(req, res) {
    var user = req.body;
    user.password = bcrypt.hashSync(user.password);
    userModel
        .createUser(user)
        .then(function (user) {
            req.login(user, function (status) {
                res.send(user);
            });
        });
}

function logout(req, res) {
    req.logout();
    res.sendStatus(200);
}

function loggedin(req, res) {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.send('0');
    }
}

function checkAdmin(req, res) {
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        res.json(req.user);
    } else {
        res.send('0');
    }
}


function localStrategy(username, password, done) {
    userModel
        .findUserByCredentials(username)
        .then(function (user) {
            if (user && bcrypt.compareSync(password, user.password)) {
                done(null, user);
            } else {
                done(null, false);
            }
        }, function (error) {
            done(error, false);
        });
}

function login(req, res) {
    res.json(req.user);
}


function deleteUser(req, res) {
    var userId = req.params.userId;

    userModel
        .deleteUser(userId)
        .then(function (status) {
            res.send(status);
        });
}


function updateUser(req, res) {
    var user = req.body;
    var userId = req.params.userId;

    userModel
        .updateUser(userId, user)
        .then(function (status) {
            res.send(status);
        })


}

function updateProfile(req, res) {
    var user = req.body;

    userModel
        .updateUser(req.user._id, user)
        .then(function (status) {
            res.send(status);
        })
}


function createUser(req, res) {
    var user = req.body;
    if (!user.password) {
        user.password = 'password';
    }
    user.password = bcrypt.hashSync(user.password);

    userModel
        .createUser(user)
        .then(function (user) {
            res.json(user);
        });
}


function findUserById(req, res) {
    var userId = req.params.userId;

    userModel
        .findUserById(userId)
        .then(function (user) {
            res.json(user);
        });
}

function findUserByPartialUsername(req, res) {
    var partialUsername = req.params.username;

    userModel
        .findUserByPartialUsername(partialUsername)
        .then(
            function (users) {
                res.status(200).send(users);
            },
            function () {
                res.sendStatus(500);
            }
        )
}

function popUserById(req, res) {
    var userId = req.params.userId;

    userModel
        .findById(userId)
        .populate('likedRecipes')
        .populate('collectedProducts')
        .exec()
        .then(function (user) {
            res.json(user);
        });
}

function follow(req, res) {
    var followingId = req.params.followingId;
    var myId = req.user._id;

    userModel
        .follow(myId, followingId)
        .then(function (user) {
            res.json(user);
        })
}

function unfollow(req, res) {
    var followingId = req.params.followingId;
    var followerId = req.user._id;
    userModel
        .unfollow(followerId, followingId)
        .then(function (user) {
            res.json(user);
        })

}

function addLikedRecipe(req, res) {
    var userId = req.user._id;
    var rId = req.params.rId;

    userModel
        .addToCollections(userId, rId, 'likedRecipes')
        .then(function (user) {
            res.json(user);
        })
}

function deleteLikedRecipe(req, res) {
    var userId = req.user._id;
    var rId = req.params.rId;

    userModel
        .deleteFromCollections(userId, rId, 'likedRecipes')
        .then(function (user) {
            res.json(user);
        })

}

function sendMessage(req, res) {
    var userId = req.params.userId;
    var message = req.body;
    var myId = req.user._id;

    userModel
        .sendMessage(myId, userId, message)
        .then(function (user) {
            res.json(user);
        });

}


function populateArr(req, res) {
    var userId = req.params.userId;
    var arrName = req.params.arrName;
    userModel
        .populateArr(userId, arrName)
        .then(function (arr) {
            var temp = arr[arrName];
            res.json(temp);
        })
        .catch(function (err) {
        })
}

function renderInMessage(req, res) {
    var userId = req.user._id;
    var associationModel = require('../models/association/association.model.server');
    associationModel
        .renderMessage(userId, 'in')
        .then(function (response) {
                res.json(response);
            }
        )
}

function renderOutMessage(req, res) {
    var userId = req.user._id;
    var associationModel = require('../models/association/association.model.server');
    associationModel
        .renderMessage(userId, 'out')
        .then(function (response) {
                res.json(response);
            }
        )
}

function bmiCal(req, res) {
    var weight = req.body.weight;
    var height = req.body.height * 2.54;

    var sendJson = {
        "weight": {"value": weight, "unit": "lb"},
        "height": {"value": height.toFixed(2), "unit": 'cm'},
        "sex": req.body.gender,
        "age": req.body.age,
        "waist": "35.00",
        "hip": "46.00"
    };

    unirest.post("https://bmi.p.mashape.com/")
        .header("X-Mashape-Key", "XW5gPJqz7PmshypQe1SzDbLzDIxvp1Bf6F7jsntRZbPSjSpS2V")
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .send(sendJson)
        .end(function (result) {
            res.send(result);
            userModel
                .addbmr(req.user._id, result.body.bmr.value);
        });
}


function findAllUsers(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    if (username && password) {
        userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                if (user) {
                    res.json(user)
                        .sendStatus(200);
                } else {
                }
                res.sendStatus(404);
            });

    } else if (username) {
        userModel
            .findUserByUsername(username)
            .then(function (user) {
                if (user) {
                    res.json(user)
                } else {
                }
                res.sendStatus(404);
            })

    }
    else {
        userModel
            .findAllUsers()
            .then(function (users) {
                res.json(users);
            });
        // res.json(users);
    }


}

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    userModel
        .findUserById(user._id)
        .then(
            function (user) {
                done(null, user);
            },
            function (err) {
                done(err, null);
            }
        );
}


////////////////Google/////////////////////
function googleStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByGoogleId(profile.id)
        .then(
            function (user) {
                if (user) {
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newGoogleUser = {
                        username: emailParts[0],
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: email,
                        google: {
                            id: profile.id,
                            token: token

                        }
                    };
                    return userModel.createUser(newGoogleUser);
                }
            },
            function (err) {
                if (err) {
                    return done(err);
                }
            }
        )
        .then(
            function (user) {
                return done(null, user);
            },
            function (err) {
                if (err) {
                    return done(err);
                }
            }
        );
}

////////////////Facebook/////////////////////
function facebookStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByFacebookId(profile.id)
        .then(
            function (user) {
                if (user) {
                    return done(null, user);
                } else {

                    var email = profile.emails[0].value;
                    // var emailParts = email.split("@");
                    var newFacebookUser = {
                        username: email,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: email,
                        facebook: {
                            id: profile.id,
                            token: token
                        }
                    };
                    return userModel.createUser(newFacebookUser);
                }
            },
            function (err) {
                if (err) {
                    return done(err);
                }
            }
        )
        .then(
            function (user) {
                return done(null, user);
            },
            function (err) {
                if (err) {
                    return done(err);
                }
            }
        );
}


function uploadImage(req, res) {
    var myFile = req.file;
    var userId = req.body.userId;

    var filename = "user/profile/" + myFile.filename;

    userModel
        .uploadImage(userId, filename)
        .then(function (status) {
            var callbackUrl = "/#!/account";
            res.redirect(callbackUrl)
        });


}