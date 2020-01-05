const Item = require('../models/item');
const Gategory = require('../models/gategory');

module.exports = async () => {
  let data = {};

  let gategories = await Gategory.findAll({});

  for (gategory of gategories) {
    data[gategory.name] = await Item.findAll({where: {gategoryId: gategory.id}, order: ['name']});
  }

  return data;
}
