const express = require('express');
const router = express.Router();
const settings = require('../lib/settings');
const SteamMarket = require('steam-market.js');
const Histogram = require('../models/histogram');
const Skin = require('../models/skin');

/* GET home page. */
router.get(['/', '/:id'], async (req, res, next) => {
  const navbar = await require('../lib/layoutData')();
  let steamId, inventory, skins, data;

  if (req.params.id) {
    steamId = req.params.id

    inventory = await SteamMarket.getInventory(steamId, 252490);
    let skinNames = inventory.items.map(x => x.name);

    skins = await Skin.findAll({where: {name: skinNames}});

    for (let skin of skins) {
      skins[skins.indexOf(skin)].histogram = await Histogram.findOne({where: {skinId: skin.id}, order: [['created_at', 'DESC']]});
    }
  }

  data = await settings(req.query);

  res.render('inventories/show', { title: 'Inventory', navbar: navbar, steamId: steamId, skins: skins, settings: req.query });
});

module.exports = router;
