let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let config = require('./config/config.json');

let indexRouter = require('./routes/index');
let genesRouter = require('./routes/genes');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(config.baseUrl, express.static(path.join(__dirname, 'public')));

app.locals.staticFilePath = (filePath) => path.join(config.baseUrl, filePath);

app.use(config.baseUrl, indexRouter);
app.use(path.join(config.baseUrl, 'genes'), genesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
