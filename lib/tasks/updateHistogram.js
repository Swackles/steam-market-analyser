const Skin = require('./../../models/skin');
const Histogram = require('./../../models/histogram');
const SteamMarket = require('steam-market.js');
const colors = require('colors');

module.exports = async () => {
  let start = process.hrtime();

  let data = await Skin.findAll({attributes: ['id', 'name', 'nameId']});
  for(let skin of data) {
    console.log(`updateHistogram... skin: ${skin.name}; count: ${data.indexOf(skin)}/${data.length}`.yellow);
    skin = skin.dataValues;
    let histogram = await SteamMarket.getHistogram(skin.nameId, 'EUR');

    histogram.skinId = skin.id;

    await Histogram.create(histogram);
    await Skin.update({price: histogram.sellOrderPrice}, {where: {id: skin.id}});
  }
}
