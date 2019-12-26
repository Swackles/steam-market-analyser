const Item = require('./../../models/item');
const SteamMarket = require('steam-market.js');
const colors = require('colors');

module.exports = async (transaction) => {
  let finished = false;

  let page = 0
  let count = 0;
  while(!finished) {
    page++;
    let request = await SteamMarket.getPopular(count * 100  + 1, 'EUR', 100, 252490);

    if (!request.success) throw new Error('Failed to get data\nERROR: data'.red)
    for (let smItem of request.results) {
      count++;
      let item = await Item.findOne({ where: {hashName: smItem.hashName}});
      console.log(`item: ${smItem.name}; count: ${count}/${request.total}; req: ${page}/${Math.ceil(request.total / 100)}`.yellow);


      if (item == null) {
        smItem.nameId = await smItem.getNameId();
        await Item.create(smItem, {transaction: transaction});
      }
    }

    if (request.results.length != 100) finished = true;
  }

  await transaction.commit();
}
