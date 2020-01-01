const Sequelize = require('sequelize');
const db = require('./../lib/db');

const item = db.define('item', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.TEXT,
  },
  nameId: {
    type: Sequelize.TEXT,
    field: 'name_id'
  },
  hashName: {
    type: Sequelize.TEXT,
    field: 'hash_name'
  },
  iconUrl: {
    type: Sequelize.TEXT,
    field: 'icon_url'
  },
  iconLargeUrl: {
    type: Sequelize.TEXT,
    field: 'icon_large_url'
  },
  tradeable: {
    type: Sequelize.BOOLEAN,
  },
  marketable: {
    type: Sequelize.BOOLEAN,
  },
  nameColor: {
    type: Sequelize.TEXT,
    field: 'name_color'
  },
  description: {
    type: Sequelize.TEXT,
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
