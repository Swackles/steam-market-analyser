const Skin = require('./../../models/skin');
const Item = require('./../../models/item');
const SteamMarket = require('steam-market.js');
const colors = require('colors');

function getItem(skin, items) {
  for (let item of items) {
    if (skin.includes(item.name)) return item.id;
  }

  return null;
}

module.exports = async (transaction) => {
  const items =  await Item.findAll({});
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

            update.itemId = getItem(smSkin.name, items);
          } else if (skin[attribute] == null) {
            if (!update) update = {};

            update[attribute] = smSkin[attribute];
          }
        }

        if (update) await skin.update(update);
      } else {
        smSkin.nameId = await smSkin.getNameId();

        smSkin.itemId = getItem(smSkin.name, items);
        await Skin.create(smSkin, {transaction: transaction});
      }
    }

    if (request.results.length != 100) finished = true;
  }

  await transaction.commit();
}
