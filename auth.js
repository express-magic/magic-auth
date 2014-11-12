'use strict';
var log     = require('magic-log')
  , schema  = false
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
;
exports.init = function(Schema, next) {
  var User   = Schema.models.User;

  schema = Schema;

  passport.use(new LocalStrategy({
      usernameField: 'name',
      passwordField: 'pass'
    },
    function(username, password, done) {
      User.findOne({ name: username }, function (err, user) {
        if (err) { return done(err); }
        if ( ! user || ! user.validatePassword(password) ) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
      });
    }
  ));

  next();
}

exports.routes = function (app, req, res, next) {
  var passportAuth = passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
  });
  app.post('/login', passportAuth);
}
