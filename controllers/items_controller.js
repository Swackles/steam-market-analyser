const express = require('express');
const router = express.Router();
const Skin = require('../models/skin');
const Item = require('../models/item');
const Histogram = require('../models/histogram');
const Settings = require('../lib/settings');
const paginate = require('express-paginate');
const db = require('./../lib/db');

router.get('/:id', async (req, res, next) => {
  const settings = new Settings(req.query);

  let item;
  let skins;

  if (isNaN(req.params.id)) {
    if (req.params.id == 'unassaigned') {
      skins = await Skin.findAndCountAll({limit: settings.limit, offset: settings.offset, where: {itemId: null}, limit: settings.limit, order: [settings.order]});
      item = {};
      item.name = 'Unassaigned skins';
    } else return res.redirect('/skins');
  } else {
    item = await Item.findByPk(req.params.id)

    if (!item) res.redirect('/');

    skins = await Skin.findAndCountAll({limit: settings.limit, offset: settings.offset, where: {itemId: req.params.id}, order: [settings.order]});
  }

  settings.pageCount = settings.getPageCount(skins.count);

  res.render('items/show', { title: item.name, skins: skins, item: item, settings: settings});
});


module.exports = router;
