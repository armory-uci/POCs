var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var dbRouter = require('./routes/db');

var app = express();
var nunjucks = require('nunjucks');

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

app.use('/', indexRouter);
app.use('/submit', dbRouter);

module.exports = app;
