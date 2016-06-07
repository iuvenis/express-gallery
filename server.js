'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const galleryRoute = require('./routes/gallery');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const setUpPassport = require('./passport/setUpPassport');
const favicon = require('serve-favicon');
const User = require('../models').User;


const app = express();
const db = require('./models');

app.set('view engine', 'jade');
app.set('views', './views');

app.use(favicon(path.resolve(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.use(flash());
app.use(session({
  secret: 'catbutts',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
      done(null, user);
    });
  });

  passport.use('login', new LocalStrategy(
    (username, password, done) => {
    User.findOne({where: {username: username}})
    .then((user) => {
      if(!user) {
        return done(null, false, {message: "The username or password is invalid"});
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if(res === true) {
          return done(null, user);
        } else {
          return done(null, false, {message: "The username or password is invalid"});
        }
      });
    })
    .catch((err) => {
      return done(err);
    });
  }));

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.errors = req.flash('error');
  res.locals.info = req.flash('info');
  next();
});

app.use('/gallery', galleryRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/logout', (req, res) => {
  req.logout();
  res.redirect('/gallery');
});

app.get('/', (req, res) => {
  res.redirect('/gallery');
});

app.get('*', (req, res) => {
  res.sendFile('/public/index.html', {
    root: __dirname
  });
});

app.use((err, req, res, next) => {
  let status = err.status || 500;

  res.status(status)
  .render('error', {
    status: err.status,
    message: err.message
  });
});

app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    message: 'Page does not Exist'
  });
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('server running on port 3000');
  });
});