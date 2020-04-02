var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv= require('dotenv');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/User');

var compression = require('compression');

var fs = require('fs');
var logFile = fs.createWriteStream('./log/LogFile.log', {flags: 'a'});
var dateFormat = require('dateformat');

var app = express();

app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

dotenv.config();
logger.token('date', (req, res, tz) => {
  return dateFormat(new Date(), "yyyy/mm/dd HH:MM:ss");
});
logger.format('myformat', ':remote-addr - :remote-user [:date]" :method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')


app.use(logger('dev'));
app.use(logger('myformat',{stream:logFile}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/api/user', usersRouter);

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
