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

      console.log(`updateSkinList... skin: ${smSkin.name}; count: ${count}/${request.total}; req: ${page}/${Math.ceil(request.total / 100)}`.yellow);

      if (skin) {
        let update;
        let properties;

        for (let key of Object.keys(skin.dataValues)) {
          if (skin[key]) continue;

          if (!update) update = {};
          if (smSkin[key]) update[key] = smSkin[key];
          else {
            if (!properties) properties = await smSkin.getAllProperties();

            switch(key.trim()) {
              case 'description':
                update[key] = properties.description;
                break;
              case 'itemId':
                let item;

                if (properties.parentItem) {
                  item = await Item.findOne({where: [{name: properties.parentItem}]});
                  if (!item) item = await Item.create({name: properties.parentItem, gategoryId: 5});
                }

                if (item) update[key] = item.id;
                break;
              case 'nameId':
                update[key] = properties.nameId;
                break;
              default:
                console.log(`updateSkinList... key: ${key} is null and unable to update`.red);
                break;
            }
          }
        }

        if (update && update != {}) skin.update(update)
      } else {
        smSkin.nameId = await smSkin.getNameId();

        smSkin.itemId = await require('./../findItem')(smSkin, items, names).id;
        await Skin.create(smSkin, {transaction: transaction});
      }
    }

    if (request.results.length != 100) finished = true;
  }

  await transaction.commit();
}
