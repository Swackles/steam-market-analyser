const Sequelize = require('sequelize');
const db = require('./../lib/db');

const taskLog = db.define('task_log', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  codeName: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'code_name'
  },
  description: {
    type: Sequelize.TEXT
  },
  status: {
    type: Sequelize.TEXT,
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

module.exports = taskLog;
