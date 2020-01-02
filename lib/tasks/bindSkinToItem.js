const Skin = require('./../../models/skin');
const Item = require('./../../models/item');
const AlternateNames = require('./../../models/alternateNames');

module.exports = async (transaction) => {
  let skins = await Skin.findAll({ where: {itemId: null}});

  let items = await Item.findAll({});
  let names = await AlternateNames.findAll({});

  for (skin of skins) {
    let item = await skin.getItem(items, names);
  }
};
