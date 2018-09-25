module.exports=(sequelize, Sequelize, force=false)=>{
  const Chat = sequelize.define('chat', {
      ip: {
        type: Sequelize.STRING, 
      },
      message: {
        type: Sequelize.STRING,
      },
      event: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.STRING,
      },
      createdAt: Sequelize.DATE,
    }).sync({force: force});

  Chat.associate = function(models){
    models.chat.belongsTo(models.user)
  }

  return Chat
}
