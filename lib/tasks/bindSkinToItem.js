const Skin = require('./../../models/skin');
const Item = require('./../../models/item');
const AlternateNames = require('./../../models/alternateName');
const colors = require('colors');

module.exports = async (transaction) => {
  let skins = await Skin.findAll({ where: {itemId: null}});

  let items = await Item.findAll({});
  let names = await AlternateNames.findAll({});

  for (skin of skins) {
    console.log(`bindSkinToItem... skin: ${skin.name}; count: ${skins.indexOf(skin)}/${skins.length}`.yellow);
    let item = await skin.getItem(items, names);

    if(item) await skin.update({itemId: item.id}, {transaction: transaction});
  }

  await transaction.commit();
};
