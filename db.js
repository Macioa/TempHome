const Sequelize = require('sequelize');

const sequelize = /*process.env.DATABASE_URL||*/require('./localenv');

const chalk = require('chalk')

sequelize
  .authenticate()
  .then(() => {
    console.log(chalk.green('Connected to database.'));
  })
  .catch(err => {
    console.error(chalk.red('Unable to connect to the database:', err));
  });

  

  module.exports=sequelize