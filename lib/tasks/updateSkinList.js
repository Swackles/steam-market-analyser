const Skin = require('./../../models/skin');
const Item = require('./../../models/item');
const AlternateNames = require('./../../models/alternateNames');
const SteamMarket = require('steam-market.js');
const colors = require('colors');

module.exports = async (transaction) => {
  const items =  await Item.findAll({});
  const names = await AlternateNames.findAll({});
  let finished = false;

  let page = 0
  let count = 0;
  while(!finished) {
    page++;
    let request = await SteamMarket.getPopular(count + 1, 'EUR', 100, 252490);

    if (!request.success) throw new Error('Failed to get data\nERROR: data'.red)
    for (let smSkin of request.results) {
      count++;
      let skin = await Skin.findOne({ where: {hashName: smSkin.hashName}});
      console.log(`updateskinList... skin: ${smSkin.name}; count: ${count}/${request.total}; req: ${page}/${Math.ceil(request.total / 100)}`.yellow);

      let update = false
      if (skin != null) {
        for (attribute of skin._options.attributes) {
          if (attribute == 'itemId' && skin[attribute] == null) {
            if (!update) update = {};

            update.itemId = await require('../findItem')(smSkin.name, items, names);
          } else if (skin[attribute] == null) {
            if (!update) update = {};

            update[attribute] = smSkin[attribute];
          }
        }

        if (update) await skin.update(update);
      } else {
        smSkin.nameId = await smSkin.getNameId();

        smSkin.itemId = await require('../findItem')(smSkin.name, items, names);
        await Skin.create(smSkin, {transaction: transaction});
      }
    }

    if (request.results.length != 100) finished = true;
  }

  await transaction.commit();
}
