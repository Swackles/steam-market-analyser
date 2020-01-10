const express = require('express');
const router = express.Router();
const settings = require('../lib/settings');
const SteamMarket = require('steam-market.js');
const Histogram = require('../models/histogram');
const Skin = require('../models/skin');

/* GET home page. */
router.get(['/', '/:id'], async (req, res, next) => {
  const navbar = await require('../lib/layoutData')();
  let steamId, inventory, skins, data, noUser;

  if (req.params.id) {
    steamId = req.params.id

    try {
      inventory = await SteamMarket.getInventory(steamId, 252490);
      let skinNames = inventory.items.map(x => x.name);

      skins = await Skin.findAll({where: {name: skinNames}});
    } catch(err) {
      noUser = true
    }
  }

  data = await settings(req.query);

  res.render('inventories/show', { title: 'Inventory', navbar: navbar, steamId: steamId, skins: skins, settings: data, noUser: noUser });
});

module.exports = router;
