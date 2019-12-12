const TaskLog = require('./../../models/taskLog');
const Item = require('./../../models/item');
const Histogram = require('./../../models/histogram');
const SteamMarket = require('steam-market.js');
const db = require('./../db');
const delay = require('delay');
const colors = require('colors');

module.exports = async () => {
  let start = process.hrtime();
  let startCount = Item.count();

  console.log("STARTING... updateHistogram".yellow);
  let log = await TaskLog.create({
    codeName: 'UPDATE_HISTOGRAM',
    status: 'RUNNING'
  });

  // new transaction
  let transaction = await db.transaction();

  try {
    let start = process.hrtime();

    let data = await Item.findAll({attributes: ['id', 'nameId']});
    for(let item of data) {
      item = item.dataValues;
      //await delay(7000);
      let histogram = await SteamMarket.getHistogram(item.nameId, 'EUR');

      histogram.itemId = item.id;

      await Histogram.create(histogram, { transaction: transaction });
    }

    await transaction.commit();

    let end = process.hrtime(start);
    let endCount = Item.count() - startCount;
    TaskLog.update({status: 'COMPLETED', description: `Completed in ${end[0]}s ${end[1] / 1000000}ms`}, {where: {id: log.dataValues.id}});

    console.log("COMPLETED! updateHistogram".green);
  } catch(err) {
    await transaction.rollback();
    console.log(err);
    await TaskLog.update({status: 'FAILED', description: `${err}`}, {where: {id: log.dataValues.id}});

    console.log("FAILED! updateHistogram".red);
    console.log(`${err}`.red);
  }
}
