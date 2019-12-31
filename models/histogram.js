const Sequelize = require('sequelize');
const db = require('./../lib/db');

const item = db.define('histogram', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  itemId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'item_id',
    references: 'items',
    references_key: 'id'
  },
  buyOrders: {
    type: Sequelize.INTEGER,
    field: 'buy_orders',
    allowNull: false
  },
  buyOrderPrice: {
    type: Sequelize.DOUBLE,
    field: 'buy_order_price',
    allowNull: false
  },
  buyOrderGraph: {
    type: Sequelize.JSON,
    field: 'buy_order_graph',
    allowNull: false
  },
  sellOrders: {
    type: Sequelize.INTEGER,
    field: 'sell_orders',
    allowNull: false
  },
  sellOrderPrice: {
    type: Sequelize.DOUBLE,
    field: 'sell_order_price',
    allowNull: false
  },
  sellOrderGraph: {
    type: Sequelize.JSON,
    field: 'sell_order_graph',
    allowNull: false
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

module.exports = item;
