const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();
const cors = require('cors');
const session = require('express-session');

const nunjucks = require('nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(session({
  secret: ['veryimportantsecret','notsoimportantsecret','highlyprobablysecret'],  
  name: "secretname",
  cookie: {
    httpOnly: false,
    // httpOnly: true,
    // TODO: uncomment below two when we fix the same site cookie set error by either secure: true ssl or by using other window.
    // secure: true,
    // sameSite: 'none',
    maxAge: 600000 // Time is in miliseconds
  }
}))

app.use('/', indexRouter);

module.exports = app;
