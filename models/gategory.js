const Sequelize = require('sequelize');
const db = require('./../lib/db');

const gategory = db.define('gategory', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
    name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

module.exports = gategory;
