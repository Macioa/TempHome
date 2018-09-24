const Sequelize = require('sequelize');

class Chat{
  constructor(sequelize, force=false){ 
  this.sequelize=sequelize
  sequelize.define('chat', {
      uderid: {
        type: Sequelize.STRING, 
      },
      message: {
        type: Sequelize.STRING,
      },
      event: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.STRING,
      }
    }).sync({force: force});
  }
}

module.exports=Chat