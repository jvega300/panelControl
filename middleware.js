var passport      = require('passport')
var LocalStrategy = require('passport-local').Strategy

var config        = require('./config'); 
var User          = require('./app/models/user'); 


// Middleware de passport 
passport.use(new LocalStrategy( function(username, password, done) {

    User.getUserByUsername(username, function (err, user){
      if (err) console.log(err);
          if(!user){
              return done(null, false, {message: 'Usuario desconocido'})
          }

          User.comparePassword (password, user.password, function (err, isMatch){
          if (err) console.log(err);
              if (isMatch){
                  return done(null, user);
              }else{
                  return done(null, false, {message: 'Contraseña incorrecta'});
              }
          })
      })
    }
));

// Metodos passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

