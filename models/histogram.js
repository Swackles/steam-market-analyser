const Sequelize = require('sequelize');
const db = require('./../lib/db');

const histogram = db.define('histogram', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  skinId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'skin_id',
    references: 'skins',
    references_key: 'id'
  },
  buyOrders: {
    type: Sequelize.INTEGER,
    field: 'buy_orders',
    allowNull: false
  },
  buyOrderPrice: {
    type: Sequelize.DOUBLE,
    field: 'buy_order_price'
  },
  buyOrderGraph: {
    type: Sequelize.JSON,
    field: 'buy_order_graph'
  },
  sellOrders: {
    type: Sequelize.INTEGER,
    field: 'sell_orders',
    allowNull: false
  },
  sellOrderPrice: {
    type: Sequelize.DOUBLE,
    field: 'sell_order_price'
  },
  sellOrderGraph: {
    type: Sequelize.JSON,
    field: 'sell_order_graph'
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at'
  }
});

module.exports = histogram;
