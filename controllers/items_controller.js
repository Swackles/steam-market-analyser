const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const Histogram = require('../models/histogram');
const paginate = require('express-paginate');

/* GET users listing. */
router.get(['/'], async (req, res, next) => {
  let items = await Item.findAll({order: [['created_at', 'DESC']], limit: 12});

  for (let item of items) {
    let histogram = await Histogram.findOne({where: {itemId: item.id}, order: [['created_at', 'DESC']]})
    items[items.indexOf(item)].histogram = histogram;
    console.log(items[items.indexOf(item)]);
  }

  res.render('items/index', { title: 'items', items: items});
});

module.exports = router;
