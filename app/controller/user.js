var express = require('express');
var flash = require('connect-flash');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bcrypt      = require('bcrypt');
var mongoose    = require('mongoose');


var User = require('../models/user')
var Post = require('../models/postes')

var config = require('../../config'); // get our config file
var middleware = require('../../middleware')


function getRoot (req, res, next) {

  Post.find(function(err, posts) {
    if (err) {
        console.log('Error al listar usuarios: ' + err);
        res.send({'error':'Algo ocurrió'});
    } else {
        console.log(posts)
      res.render('index', {posts})

    }
  })
};




function userLogin (req, res, next) {
    res.render('login')
};

function userRegister (req, res, next) {

    res.render('register')
};

function userPostRegister (req, res, next) {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    // Validación
    req.checkBody ('username', 'El nombre es obligatorio').notEmpty();
    req.checkBody ('email', 'El email es obligatorio').notEmpty();
    req.checkBody ('email', 'La dirección de email no es correcta').isEmail();
    req.checkBody ('password', 'La contraseña es obligatorio').notEmpty();

    var errores = req.validationErrors();

    if(errores){
        res.render('./register',{
            errores:errores
        });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            admin: req.body.isadmin,
            email : req.body.email
        })
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user)
        })

        req.flash('success_msg', 'Te has registrado correctamente');
        res.redirect('./login');
    }
};

function userLogout (req, res, next) {
    req.logout();
    req.flash('success_msg', 'Deslogueado correctamente');
    res.redirect('/');
};

function getUsers (req, res){
  User.find(function(err, result) {
      if (err) {
          console.log('Error al listar usuarios: ' + err);
          res.send({'error':'Algo ocurrió'});
      } else {
          req.flash('success_msg', 'Lista de Usuarios');
          res.send(result)
      }
    })
}

function pageError (req, res) {
    req.flash('error_msg', 'Algo mal has hecho');
    res.render('error')
};

// POSTS
/********************************************************************************************************/
function newPost (req, res, next) {
    res.render('newPost')
};

function newPostSave(req, res){

  let post = new Post()
  post.p_title = req.body.p_titulo
  post.p_head = req.body.p_entrada
  post.p_contet = req.body.p_cuerpo

  post.save((err,postStored) => {
    if(err) res.status(500).send({message: `Error al salvar los datos ${err}`})

    res.redirect('/');
  })
}

function getPosts (req, res, next) {

  Post.find(function(err, posts) {
    if (err) {
        console.log('Error al listar usuarios: ' + err);
        res.send({'error':'Algo ocurrió'});
    } else {
        res.send(posts)
    }
  })
};



// Función de control de rutas, de aquí para abajo queda securizado por el login de usuario, si no a error
/********************************************************************************************************/
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); }

  res.redirect('/error')
}

function userUpdate (req, res, next) {
    console.log("en userUpdate")
    User.findById(req.params.id,(err,user) => {
        if(err){
            res.status(500).send({message: `Error al buscar los productos:  ${err}`})
        }else if(!user){
            res.status(404).send({message: `El producto no existe`})
        }else{
            res.render('actualizarPerfil', { user })
        }
    });
};

function userUpdatePost (req, res, next) {

    // Validación
    req.checkBody ('username', 'El nombre es obligatorio').notEmpty();
    req.checkBody ('email', 'El email es obligatorio').notEmpty();
    req.checkBody ('email', 'La dirección de email no es correcta').isEmail();

    var errores = req.validationErrors();

    if(errores){
        res.render('actualizarPerfil',{
            errores:errores
        });
    } else {

        User.findOneAndUpdate({_id:req.params.id}, {username: req.body.username,admin: req.body.isadmin,email : req.body.email}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error al actualizar: ' + err);
                res.send({'error':'Algo ocurrió'});
            } else {
                req.flash('success_msg', 'Te has modificado correctamente');
                res.redirect('/');
            }
        });
    }
};

function userPassword (req, res, next) {
    res.render('passUpdate')
}

function userPasswordPost (req, res, next) {

    req.checkBody ('password', 'No puede quedarse vacio').notEmpty();

    var errores = req.validationErrors();

    if(errores){
        res.render('passUpdate',{
            errores:errores
        });
    } else {

        var updateUser = new User({
            password: req.body.password,
        })

        // Por placer, comparo a ver si ha ingresado una nueva clave
        bcrypt.compare(req.body.password, req.user.password).then(function(res) {
            if (res){
                req.flash('success_msg', 'La contraseña introducida es la misma');
                console.log('La contraseña introducida es la misma');
            }else{
                console.log("Es distinto, ahora lo guardamos");
                User.updatePassword(req.body.password, req.params.id);
            }
        });
    }
};



module.exports = {newPost, getPosts, newPostSave, getUsers, getRoot, userLogin, userRegister, userPostRegister, userLogout, pageError, userUpdate, userUpdatePost, ensureAuthenticated,userPassword, userPasswordPost }
