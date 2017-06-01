var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var flash       = require('connect-flash');
var ejs         = require('ejs');
var path        = require('path');
var exphbs      = require('express-handlebars');
var bcrypt      = require('bcrypt');
var session     = require('express-session')
var passport    = require('passport')
var LocalStrategy = require('passport-local').Strategy

var config      = require('./config');
var User        = require('./app/models/user');

var indexes   = require('./app/routes/index');
var usersRutas   = require('./app/routes/users');

var methodOverride   = require('method-override') //Override de los metodos post y put
var expressValidator = require('express-validator');

var app = express();

// Motor de plantillas
app.set('views', path.join(__dirname, 'views/'));
app.engine('handlebars', exphbs({defaultLayout:'layouts'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie:{maxAge:14400000} //La sesión expira tras 4 horas
}));

app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Conectar Flash
app.use(flash());

// Variables globales
app.use(function (req, res, next){
    res.locals.msg_exito = req.flash('success_msg');
    res.locals.msg_error = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

app.use('/', usersRutas);

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.listen(port);
console.log('Servidor en http://localhost:' + port);
