const express = require('express')
const indexes = express.Router();
const UserCtrl = require('../controller/user')

indexes.get('/error', UserCtrl.pageError)

module.exports = indexes
