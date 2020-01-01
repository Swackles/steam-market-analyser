const express = require('express');
const router = express.Router();
const Skin = require('../models/skin');
const Histogram = require('../models/histogram');
const paginate = require('express-paginate');
const db = require('./../lib/db');

/* GET users listing. */
router.get(['/'], async (req, res, next) => {
  let skins = await Skin.findAll({order: [['created_at', 'DESC']], limit: 12});

  for (let skin of skins) {
    let histogram = await Histogram.findOne({where: {skinId: skin.id}, order: [['created_at', 'DESC']]});
    skins[skins.indexOf(skin)].histogram = histogram;
    console.log(skins[skins.indexOf(skin)]);
  }

  let navbar = await require('../lib/layoutData')();

  res.render('skins/index', { title: 'skins', skins: skins, navbar: navbar});
});

router.get('/:id', async (req, res, next) => {
  let skin = await Skin.findOne({where: {id: req.params.id}});
  let histograms = await Histogram.findAll({where: {skinId: skin.id}, order: [['created_at', 'DESC']]});

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
  skin.histogram = histograms[0]

  let navbar = await require('../lib/layoutData')();

  console.log(navbar);

  res.render('skins/show', { title: skin.name, skin: skin, histograms: histograms, orders: orders[0][0], navbar: navbar});
});

module.exports = router;
