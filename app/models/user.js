// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;

// set up a mongoose model and pass it using module.exports
var UserSchema = mongoose.Schema({

    username: String,
    password: String,
    admin: Boolean ,
    email : String
});

var User = module.exports = mongoose.model('User', UserSchema, 'users')

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.updatePassword = function(updatePassword, idUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(updatePassword, salt, function(err, hash) {
            console.log("El usuario es :"+idUser+" y la clave nueva es "+hash )
            User.findOneAndUpdate({_id: idUser}, {password: hash}, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error al actualizar: ' + err);
                }else{
                    console.log(result);
                }
            });
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username : username}
    User.findOne (query, callback)
}

module.exports.getUserById = function(id, callback){
    User.findById (id, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {

    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch)
    });
};
