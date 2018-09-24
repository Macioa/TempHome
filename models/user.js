
module.exports=(sequelize, Sequelize, force=false)=>{
  const User = sequelize.define('user', {
      ip: {
        type: Sequelize.STRING, 
        primaryKey: true,
        createdAt: Sequelize.DATE,
      },
      names: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        updatedAt: Sequelize.DATE,
      },
      recentName:{
        type: Sequelize.STRING, 
        updatedAt: Sequelize.DATE,
      }
    }).sync({force: force})

    User.associate = function(models) {
        models.user.hasMany(models.chat);
    };

  return User
}
