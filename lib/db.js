const Sequelize = require('sequelize');

module.exports = new Sequelize('postgres', 'postgres', '', {
  host: 'localhost',
  port: 10001,
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});
