// node_modules
const schedule = require('node-schedule');
const colors = require('colors');

//lib
const db = require('./lib/db');
const tasks = require('./lib/tasks');

db.authenticate()
  .then(() => console.log("Databse connected...".green))
  .catch(err => console.log(`ERROR: ${err}`.red));

process.argv.forEach((val, index, array) => {
  let regex = val.match(/(.*?)=(.*?)$/);
  if (regex != null && regex[1] == 'run') {
    tasks(regex[2]);
  }
});

let updateItemList = schedule.scheduleJob('* * 15 * * 3', () => {
  tasks.updateItemList();
});
