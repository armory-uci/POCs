var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
var cors = require('cors');
var session = require('express-session');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(session({
  secret: ['veryimportantsecret','notsoimportantsecret','highlyprobablysecret'],  
   name: "secretname",
  cookie: {
      httpOnly: false,
      // httpOnly: true,
      // secure: true,
      // sameSite: true,
      maxAge: 600000 // Time is in miliseconds
  }
}))


app.use('/', indexRouter);

module.exports = app;
