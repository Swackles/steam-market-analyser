const Skin = require('./../../models/skin');
const Item = require('./../../models/item');
const SteamMarket = require('steam-market.js');
const colors = require('colors');

module.exports = async () => {
  let skins = await Skin.findAll({ where: {itemId: null}});
  let items = await Item.findAll({});

  for (skin of skins) {
    console.log(`bindSkinToItem... skin: ${skin.name}; count: ${skins.indexOf(skin)}/${skins.length}`.yellow);

    let response = await SteamMarket.findItem(skin.name, 'EUR', 252490);
    
    for (smSkin of response.results) {
      let properties = await smSkin.getAllProperties();
      console.log(properties);
      if (skin.nameId == properties.nameId) {
        let item, itemId;
        if (properties.parentItem) item = await Item.findOrCreate({where: {name: properties.parentItem}, defaults: {gategoryId: 5}});

        if (item && item[0]) itemId = item[0].id;
        await skin.update({itemId: itemId, description: properties.description});
      } else break;
    }
  }

};
