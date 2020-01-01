const express = require('express');
const router = express.Router();
const Skin = require('../models/skin');
const Item = require('../models/item');
const Histogram = require('../models/histogram');
const paginate = require('express-paginate');
const db = require('./../lib/db');

router.get('/:id', async (req, res, next) => {
  const navbar = await require('../lib/layoutData')();
  let item;
  let skins;

  if (isNaN(req.params.id)) {
    if (req.params.id == 'unassaigned') {
      skins = await Skin.findAll({where: {itemId: null}, limit: 50, order: [['created_at', 'ASC']]});
      item = {};
      item.name = 'Unassaigned skins';
    } else return res.redirect('/skins');
  } else {
    skins = await Skin.findAll({where: {itemId: req.params.id}, order: [['created_at', 'ASC']]});
    item = await Item.findOne({where: {id: req.params.id}});

    for (let skin of skins) {
      let histogram = await Histogram.findOne({where: {skinId: skin.id}, order: [['created_at', 'DESC']]});
      skins[skins.indexOf(skin)].histogram = histogram;
      console.log(skins[skins.indexOf(skin)]);
    }
  }


  res.render('items/show', { title: item.name, skins: skins, item: item, navbar: navbar});
});


module.exports = router;
