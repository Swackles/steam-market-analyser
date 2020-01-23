const Sequelize = require('Sequelize');
const Op = Sequelize.Op;
const express = require('express');
const router = express.Router();
const Skin = require('../models/skin');
const Histogram = require('../models/histogram');
const Item = require('../models/item');
const paginate = require('express-paginate');
const db = require('./../lib/db');
const Settings = require('../lib/settings');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let params = {
    limit: res.locals.settings.limit,
    offset: res.locals.settings.offset,
    order: [res.locals.settings.order],
    limit: res.locals.settings.limit
  };

  let skins = await Skin.findAndCountAll(params);

  for (let skin of skins.rows) {
    let item = await Item.findByPk(skin.itemId)

    skins.rows[skins.rows.indexOf(skin)].item = item;
  }

  res.render('skins/index', { title: 'skins', skins: skins});
});

router.get('/search/:query', async (req, res, next) => {
  let params = {
    where: {
      name: {
        [Op.like]: `%${req.params.query}%`
      }
    },
    limit: res.locals.settings.limit,
    offset: res.locals.settings.offset}

  let skins = await Skin.findAndCountAll(params);

  res.locals.settings.size = 'list';

  res.render('skins/_skin', {skins: skins});
});

router.get('/:id', async (req, res, next) => {
  if (isNaN(req.params.id)) return res.redirect('/skins');


  let skin = await Skin.findByPk(req.params.id)

  if (!skin) res.redirect('/');

  skin.item = await Item.findByPk(skin.itemId);

  let is = {};

  for (i of skin._options.attributes) {
    is[i] = skin[i];
  }

  let orders = await db.query(`SELECT
    ARRAY(SELECT created_at from histograms where skin_id = ${skin.id} AND created_at > current_date - interval '7 days' order by created_at) AS labels,
    ARRAY(SELECT buy_orders FROM histograms where skin_id = ${skin.id} AND created_at > current_date - interval '7 days' order by created_at) AS buyOrders,
    ARRAY(SELECT sell_orders FROM histograms where skin_id = ${skin.id} AND created_at > current_date - interval '7 days' order by created_at) AS sellOrders,
    ARRAY(SELECT buy_order_price FROM histograms where skin_id = ${skin.id} AND created_at > current_date - interval '7 days' order by created_at) AS buyprice,
    ARRAY(SELECT sell_order_price FROM histograms where skin_id = ${skin.id} AND created_at > current_date - interval '7 days' order by created_at) AS sellprice`);

  const months = ["Jan",	"Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  orders[0][0].labels = orders[0][0].labels.map(x => months[new Date(x).getMonth()] + " " + new Date(x).getDate() + " " + new Date(x).getHours() + ":00")

  res.render('skins/show', { title: skin.name, skin: skin, orders: orders[0][0]});
});

router.post('/:id', async (req, res, next) => {
  let skin = await Skin.update({itemId: req.body.itemId}, {where: {id: req.params.id}});

  res.redirect(`/skins/${req.params.id}`);
});

module.exports = router;
