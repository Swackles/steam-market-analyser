const Skin = require('./../../models/skin');
const SteamMarket = require('steam-market.js');
const colors = require('colors');

module.exports = async (transaction) => {
  let finished = false;

  let page = 0
  let count = 0;
  while(!finished) {
    page++;
    let request = await SteamMarket.getPopular(count + 1, 'EUR', 100, 252490);

    if (!request.success) throw new Error('Failed to get data\nERROR: data'.red)
    for (let smskin of request.results) {
      count++;
      let skin = await Skin.findOne({ where: {hashName: smskin.hashName}});
      console.log(`updateskinList... skin: ${smskin.name}; count: ${count}/${request.total}; req: ${page}/${Math.ceil(request.total / 100)}`.yellow);

      let update = false

      for (attribute of skin._options.attributes) {
        if (skin[attribute] == null) {
          if (!update) update = {};

          update[attribute] = smskin[attribute];
        }
      }

      if (skin == null) {
        smskin.nameId = await smskin.getNameId();
        await skin.create(smskin, {transaction: transaction});
      } else if (update) {
        await skin.update(update)
      }
    }

    if (request.results.length != 100) finished = true;
  }

  await transaction.commit();
}
