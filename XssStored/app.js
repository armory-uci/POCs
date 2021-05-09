const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();
const cors = require('cors');
const session = require('express-session');

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
