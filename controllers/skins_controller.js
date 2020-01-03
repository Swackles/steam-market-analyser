const express = require('express');
const router = express.Router();
const Skin = require('../models/skin');
const Histogram = require('../models/histogram');
const Item = require('../models/item');
const paginate = require('express-paginate');
const db = require('./../lib/db');

/* GET users listing. */
router.get(['/'], async (req, res, next) => {
  const navbar = await require('../lib/layoutData')();
  let skins = await Skin.findAll({order: [['created_at', 'DESC']], limit: 12});

  for (let skin of skins) {
    let histogram = await Histogram.findOne({where: {skinId: skin.id}, order: [['created_at', 'DESC']]});
    let item = await Item.findOne({where: {id: skin.itemId}});

    skins[skins.indexOf(skin)].item = histogram
    skins[skins.indexOf(skin)].histogram = histogram;
  }


  res.render('skins/index', { title: 'skins', skins: skins, navbar: navbar});
});

router.get('/:id', async (req, res, next) => {
  if (isNaN(req.params.id)) return res.redirect('/skins');

  const navbar = await require('../lib/layoutData')();
  let skin = await Skin.findOne({where: {id: req.params.id}});

  skin.histograms = await Histogram.findAll({where: {skinId: skin.id}, order: [['created_at', 'DESC']]});
  skin.histogram = skin.histograms[0]

  skin.item = await skin.getItemOffline();

  let is = {};

  for (i of skin._options.attributes) {
    is[i] = skin[i];
  }

  let orders = await db.query(`SELECT
    ARRAY(SELECT created_at from histograms where skin_id = ${skin.id} order by created_at) AS labels,
    ARRAY(SELECT buy_orders FROM histograms where skin_id = ${skin.id} order by created_at) AS buyOrders,
    ARRAY(SELECT sell_orders FROM histograms where skin_id = ${skin.id} order by created_at) AS sellOrders,
    ARRAY(SELECT buy_order_price FROM histograms where skin_id = ${skin.id} order by created_at) AS buyprice,
    ARRAY(SELECT sell_order_price FROM histograms where skin_id = ${skin.id} order by created_at) AS sellprice`);

  const months = ["Jan",	"Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  orders[0][0].labels = orders[0][0].labels.map(x => months[new Date(x).getMonth()] + " " + new Date(x).getDate() + " " + new Date(x).getHours() + ":00")

  res.render('skins/show', { title: skin.name, skin: skin, orders: orders[0][0], navbar: navbar});
});

module.exports = router;
