module.exports=(sequelize, Sequelize, force=false)=>{
  const Chat = sequelize.define('chat', {
      userid: {
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
      },
      createdAt: Sequelize.DATE,
    }).sync({force: force});

  Chat.associate = function(models){
    models.chat.belongsTo(models.user)
  }

  return Chat
}
