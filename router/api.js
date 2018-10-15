const express = require('express')
const Router = express.Router()

const Sequelize = require('sequelize')

Router.use(require('./apiauth'))

const models = require('../models/')

const processQuery = (queries) => {
    let returnobj = {}
    for (let key in queries) {
        returnobj[key] = queries[key].replace(/["']/g,'')
        returnobj[key] = returnobj[key].replace('[','').replace(']','').split(',')
        switch (key){
            case 'names': returnobj[key]={$contains : returnobj[key]}; break;
            case 'createdAt':
            case 'updatedAt': 
                returnobj[key] = returnobj[key].map(dateString=>new Date(dateString))
                returnobj[key] = {$gte : returnobj[key][0], $lte : (returnobj[key][1])? returnobj[key][1]:new Date()}
        }
    }
    return returnobj
}

Router.get('/users', async (req, res) => {
    console.log(req.headers)
    console.log(req.query)
    console.log('users')
    const Op = Sequelize.Op
    let users = await models.user.findAll({where: processQuery(req.query)})
    //let users = await models.user.findAll({where: {names: {$contains:['RyanAtHome']} } })
    res.json({
          status: 200,
          data: users
        });
    // console.log(processQuery(req.query))
    // res.send('received')
})

Router.get('/logs', async (req, res) => {
    console.log(req.headers)
    console.log(req.query)

    let chats = await models.chats.findAll({where: processQuery(req.query)})
    res.json({
          status: 200,
          data: users
        });
})

Router.post('/newkey', (req, res) => {

})

module.exports=Router