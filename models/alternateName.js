const Sequelize = require('sequelize');
const db = require('./../lib/db');

const alternateName = db.define('alternate_name', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  itemId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'item_id',
    references: 'item',
    references_key: 'id'
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at',
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at',
  }
});

module.exports = alternateName;
