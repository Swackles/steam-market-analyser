// node_modules
const cron = require('cron');
const colors = require('colors');
const express = require('express');

//lib
const db = require('./lib/db');

db.authenticate()
  .then(() => console.log("Databse connected...".green))
  .catch(err => console.log(`ERROR: ${err}`.red));

process.argv.forEach((val, index, array) => {
  let regex = val.match(/(.*?)=(.*?)$/);
  if (regex != null && regex[1] == 'run') {
    require(`./lib/tasks`)(regex[2]);
  }
});

new cron.CronJob('0 0 * * *', () => {
  require('./lib/tasks')('updateItemList');
}, null, true, 'Europe/Tallinn');

new cron.CronJob('0 */1 * * *', () => {
  require('./lib/tasks')('updateHistogram');
}, null, true, 'Europe/Tallinn');
