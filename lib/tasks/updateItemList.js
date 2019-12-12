const TaskLog = require('./../../models/taskLog');
const Item = require('./../../models/item');
const SteamMarket = require('steam-market.js');
const db = require('./../db');
const delay = require('delay');
const colors = require('colors');

module.exports = async () => {

  let start = process.hrtime();
  let startCount = Item.count();

  console.log("STARTING... updateItemList".yellow);
  let log = await TaskLog.create({
    codeName: 'UPDATE_ITEM_LIST',
    status: 'RUNNING'
  });

  // new transaction
  let transaction = await db.transaction();

  try {
    let start = 0;
    let startTime = process.hrtime();
    let finished = false;

    let page = 0;
    while(!finished) {
      let request = await SteamMarket.getPopular(start, 'EUR', 100, 252490);

      if (!request.success) throw new Error('Failed to get data\nERROR: data'.red)
      let count = 0;
      for (let smItem of request.results) {
        let item = await Item.findOne({ where: {hashName: smItem.hashName}});
        console.log(`count: ${start + count + 1}/${request.total}; req: ${page + 1}/${Math.ceil(request.total / 100)}`.yellow);

        if (item == null) {
          smItem.nameId = await smItem.getNameId();
          await Item.create(smItem, {transaction: transaction});
        }
        count++;
      }

      page++;
      if (request.results.length == 100) start = start + 100;
      else finished = true;
    }

    await transaction.commit();

    let end = process.hrtime(startTime);
    let endCount = Item.count() - startCount;
    TaskLog.update({status: 'COMPLETED', description: `Completed in ${end[0]}s ${end[1] / 1000000}ms, with ${endCount} items added`}, {where: {id: log.dataValues.id}});

    console.log("COMPLETED! updateItemList".green);
  } catch(err) {
    await transaction.rollback();
    console.log(err);
    await TaskLog.update({status: 'FAILED', description: `${err}`}, {where: {id: log.dataValues.id}});

    console.log("FAILED! updateItemList".red);
    console.log(`${err}`.red);
  }
}
