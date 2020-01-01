const express = require('express');
const router = express.Router();
const Skin = require('../models/skin');
const Item = require('../models/item');
const paginate = require('express-paginate');
const db = require('./../lib/db');

router.get('/:id', async (req, res, next) => {
  const navbar = await require('../lib/layoutData')();
  let item;
  let skins;

  if (isNaN(req.params.id)) {
    if (req.params.id == 'unassaigned') {
      skins = await Skin.findAll({where: {itemId: null}, limit: 50});
      item = {};
      item.name = 'Unassaigned skins';
    }
  } else {
    skins = await Skin.findAll({where: {itemId: req.params.id}});
    items = await Item.findOne({where: {id: req.params.id}});
  }

  res.render('items/show', { title: item.name, skins: skins, item: item, navbar: navbar});
});


module.exports = router;
