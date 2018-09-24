const Sequelize = require('sequelize');

class User {
  constructor(sequelize, force=false){
    this.sequelize=sequelize
    sequelize.define('user', {
      ip: {
        type: Sequelize.STRING, 
        primaryKey: true
      },
      names: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      }
    }).sync({force: force});
  }
}

module.exports=User