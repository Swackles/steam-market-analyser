const TaskLog = require('./../../models/taskLog');
const Item = require('./../../models/item');
const Histogram = require('./../../models/histogram');
const SteamMarket = require('steam-market.js');
const db = require('./../db');
const delay = require('delay');
const colors = require('colors');

module.exports = async () => {
  let start = process.hrtime();

  let data = await Item.findAll({attributes: ['id', 'nameId']});
  for(let item of data) {
    item = item.dataValues;
    let histogram = await SteamMarket.getHistogram(item.nameId, 'EUR');

    histogram.itemId = item.id;

    await Histogram.create(histogram, { transaction: transaction });
  }

  await transaction.commit();
}
