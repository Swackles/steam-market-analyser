const Skin = require('./../../models/skin');
const Item = require('./../../models/item');
const AlternateNames = require('./../../models/alternateName');
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

      if (skin == null) {
        smSkin.nameId = await smSkin.getNameId();

        console.log(smSkin);
        smSkin.itemId = await require('./../findItem')(smSkin, items, names);
        await Skin.create(smSkin, {transaction: transaction});
      }
    }

    if (request.results.length != 100) finished = true;
  }

  await transaction.commit();
}
