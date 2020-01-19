const express = require('express');
const router = express.Router();
const Skin = require('../models/skin');
const Item = require('../models/item');
const Histogram = require('../models/histogram');
const Settings = require('../lib/settings');
const paginate = require('express-paginate');
const db = require('./../lib/db');

router.get('/:id', async (req, res, next) => {
  let item, skins;

  let params = {
    limit: res.locals.settings.limit,
    offset: res.locals.settings.offset,
    order: [res.locals.settings.order],
    limit: res.locals.settings.limit
  };

  if (isNaN(req.params.id)) {
    if (req.params.id == 'unassaigned') {
      params.where = { itemId: null };
      skins = await Skin.findAndCountAll(params);
      item = {};
      item.name = 'Unassaigned skins';
    } else return res.redirect('/skins');
  } else {
    item = await Item.findByPk(req.params.id)

    if (!item) res.redirect('/');

    params.where = { itemId: req.params.id }
    skins = await Skin.findAndCountAll(params);
  }

  res.render('items/show', { title: item.name, skins: skins, item: item });
});


module.exports = router;
