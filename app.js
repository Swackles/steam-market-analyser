const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const colors = require('colors');
const paginate = require('express-paginate');
const config = require('config')

const db = require('./lib/db');

db.authenticate()
  .then(() => console.log("Databse connected...".green))
  .catch(err => console.log(`ERROR: ${err}`.red));

let app = express();

app.listen(10000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(paginate.middleware(config.get('paginate.min'), config.get('paginate.max')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function controller(path) { return require(`./controllers/${path}_controller`); }

app.use('/', controller('index'));
app.use('/skins', controller('skins'));
app.use('/items', controller('items'));
app.use('/inventory', controller('inventories'));

// catch 404 and forward to error handler
app.use(async (req, res, next) => {
  res.redirect('/');
});

// error handler
app.use(async (err, req, res, next) => {
  let navbar = await require('./lib/layoutData')();

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {navbar: navbar});
});

module.exports = app;
