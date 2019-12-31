const Item = require('./../../models/item');
const Histogram = require('./../../models/histogram');
const SteamMarket = require('steam-market.js');

module.exports = async (transaction) => {
  let start = process.hrtime();

  let data = await Item.findAll({attributes: ['id', 'nameId']});
  for(let item of data) {
    console.log(`updateHistogram... item: ${item.name}; count: ${data.indexOf(item)}/${data.length}`.yellow);
    item = item.dataValues;
    let histogram = await SteamMarket.getHistogram(item.nameId, 'EUR');

    histogram.itemId = item.id;

    await Histogram.create(histogram, { transaction: transaction });
  }

  await transaction.commit();
}
