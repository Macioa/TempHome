const Sequelize = require('sequelize');

const sequelize = require('./localenv')||new Sequelize(`string`);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to database.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  module.exports=sequelize