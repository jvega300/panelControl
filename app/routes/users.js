const express = require('express')
const usersRoutes = express.Router();
const UserCtrl = require('../controller/user')
const passport = require('passport')


const middleware = require('../../middleware');

usersRoutes.get('/', UserCtrl.getRoot)
usersRoutes.get('/posts', UserCtrl.getPosts)

usersRoutes.get('/users', UserCtrl.getUsers)

usersRoutes.get('/login', UserCtrl.userLogin)
usersRoutes.post('/login',passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login',failureFlash: true }));

usersRoutes.get('/register', UserCtrl.userRegister)
usersRoutes.post('/register',  UserCtrl.userPostRegister)

usersRoutes.get('/logout', UserCtrl.userLogout)

usersRoutes.get('/actualizarPerfil/:id', UserCtrl.ensureAuthenticated, UserCtrl.userUpdate)
usersRoutes.post('/actualizarPerfil/:id', UserCtrl.ensureAuthenticated, UserCtrl.userUpdatePost)

usersRoutes.get('/passUpdate/:id',UserCtrl.ensureAuthenticated, UserCtrl.userPassword)
usersRoutes.post('/passUpdate/:id',UserCtrl.ensureAuthenticated, UserCtrl.userPasswordPost)

usersRoutes.get('/newPost', UserCtrl.newPost)
usersRoutes.post('/newPostSave', UserCtrl.newPostSave)



module.exports = usersRoutes
