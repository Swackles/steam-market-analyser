const express = require('express');
const router = express.Router();
const Settings = require('../lib/settings');
const SteamMarket = require('steam-market.js');
const Histogram = require('../models/histogram');
const Skin = require('../models/skin');
const Item = require('../models/item');

/* GET home page. */
router.get(['/'], async (req, res, next) => {
  const navbar = await require('../lib/layoutData')();

  res.render('inventories/show', { title: 'Inventory', navbar: navbar });
});

router.get('/:id', async (req, res, next) => {
  const navbar = await require('../lib/layoutData')();
  const settings = new Settings(req.query);
  const steamId = req.params.id

  console.log(settings);

  let inventory, skins, noUser, items, error;

  inventory = await SteamMarket.getInventory(steamId, 252490);

  if (typeof inventory != 'string') {
    let skinNames = inventory.items.map(x => x.name);
    skins = await Skin.findAndCountAll({where: {name: skinNames}, order: [settings.order]});

    items = skins.map(x => x.itemId);
    items = await Item.findAll({where: {id: items}, attributes: ['id', 'name']});

    for (skin of skins.rows) {
      skins.rows[skins.rows.indexOf(skin)].item = items.find(x => x.id == skin.itemId);
    }
  } else if (typeof inventory == 'string') {
    error = inventory;
  }

  res.render('inventories/show', { title: 'Inventory', navbar: navbar, steamId: steamId, skins: skins, settings: settings, error: error});
});

module.exports = router;
