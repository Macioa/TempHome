module.exports=(sequelize, Sequelize, force=false)=>{
  const Key = sequelize.define('key', {
      email: {
        type: Sequelize.STRING, 
        primaryKey: true,
        createdAt: Sequelize.DATE,
        allowNull: false
      },
      key: {
        type: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        allowNull: false
      }
    }).sync({force: force})

  return Key
}