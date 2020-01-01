const Sequelize = require('sequelize');
const db = require('./../lib/db');

const item = db.define('item', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  gategoryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'gategory_id',
    references: 'gategories',
    references_key: 'id'
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at',
  },
});

module.exports = item;
