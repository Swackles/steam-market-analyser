// node_modules
const schedule = require('node-schedule');
const colors = require('colors');

//lib
const db = require('./lib/db');

db.authenticate()
  .then(() => console.log("Databse connected...".green))
  .catch(err => console.log(`ERROR: ${err}`.red));

process.argv.forEach((val, index, array) => {
  let regex = val.match(/(.*?)=(.*?)$/);
  if (regex != null && regex[1] == 'run') {
    require(`./lib/tasks/${regex[2]}`)();
  }
});

let updateItemList = schedule.scheduleJob('0 0 * * *', () => {
  require('./lib/tasks')('updateItemList');
});

let updateHistogram = schedule.scheduleJob('0 */6 * * *', () => {
  require('./lib/tasks')('updateHistogram');
});
