const fs = require('fs');
const path = require('path');
const index = path.basename(__filename);
const Sequelize = require('sequelize')
const sequelize = require('../db')
const db = {}
const force = true

//find all model files and import them to sequelize
fs.readdirSync(__dirname)
    .filter(file=>(file !== index) && (file.slice(-3) === '.js'))
    .forEach(file=>{
        model = sequelize.import( path.join(__dirname, file) )
        Promise.resolve(model).then(value=>db[file.replace('.js','')]=value)
    })

module.exports=db