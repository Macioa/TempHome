const express = require('express')
const Router = express.Router()

const Sequelize = require('sequelize')

Router.use(require('./apiauth'))

const models = require('../models/')

const Aliases = require('../SequelizeAliases')

const chalk = require('chalk')

const processQuery = (queries) => {
    let returnobj = {}
    for (let key in queries) {
                console.log(queries[key])
        returnobj[key] = queries[key].replace(/["']/g,'')
        returnobj[key] = returnobj[key].replace('[','').replace(']','').split(',')
        switch (key){
            case 'names': returnobj[key]={$contains : returnobj[key]}; break;
            case 'recentName' : 
                returnobj[key].forEach((item,i) => {if(item.indexOf('%')!=-1) returnobj[key][i]={$like : item}} )
                if (returnobj[key].length>1) returnobj[key] = {[Aliases.$or]:returnobj[key]}
                else returnobj[key]=returnobj[key][0]
                break;
            case 'createdAt':
            case 'updatedAt': 
                returnobj[key] = returnobj[key].map(dateString=>new Date(dateString))
                returnobj[key] = {$gte : returnobj[key][0], $lte : (returnobj[key][1])? returnobj[key][1]:new Date()}
        }

    }
    console.log('processed',returnobj)
    return returnobj
}

Router.get('/users', async (req, res) => {
    {
       let users = await models.user.findAll({where: processQuery(req.query)})
        res.json({
            status: 200,
              data: users
            });
    }
})

Router.get('/logs', async (req, res) => {
   try {
        let userQuery = {}, chats = null, miscReq = {}
        for (let k of ['names', 'recentName','ip']) if (req.query[k]) userQuery[k] = req.query[k]
        Object.assign(miscReq, req.query)
        for (let k of ['names','messages','recentName','ip','events','uniqueOnly']) delete req.query[k]

        if (userQuery['names']||userQuery['recentName']||userQuery['ip']){

            let users = await models.user.findAll({where: processQuery(userQuery)})

            if (!users.length) {
                res.json({
                    status:200,
                    data:"No users found for search criteria"
                })
                return }

            chats = await models.chat.findAll({where: processQuery(req.query)})

            if (users.length) chats.forEach(chat=>{
                chat.match = false
                users.forEach((user)=>{ if (user.ip==chat.ip) {
                    chat.match = true
                    chat.dataValues.user = user.recentName
                    }})
            })

            chats = chats.filter(chat => chat.match)

        } else { 
            chats = await models.chat.findAll({where: processQuery(req.query)}) 
            let userips = {}
            console.log(chalk.blue("TEST"))
            console.log(chalk.yellow(chats.length))
            chats.forEach(async (chat,i)=>{
                console.log(chalk.blue("********HELLO********"))
                console.log(Object.keys(chat),chat.dataValues.ip)
                if (!userips[chat.dataValues.ip]){
                    let user = await models.user.findOne({where: {ip:chat.dataValues.ip} })
                    console.log(chalk.blue(Object.keys(chat.dataValues)))
                    console.log(chalk.blue(chat.dataValues.ip))
                    userips[user.dataValues.ip] =  user
                    //console.log(userips[chat.ip])
                    chat.dataValues.user = user.dataValues.recentName
                    console.log(Object.keys(userips))
                    console.log(chalk.red(i))
                    return user
                } else {
                    chat.user = userips[chat.dataValues.ip].user.dataValues.recentName
                }
            })
            console.log(Object.keys(userips))
        }

        // chats.forEach(chat=>{
        //     for (let k of ['updatedAt','id','ip']) delete chat.dataValues[k]
        //     for (let k of ['event', 'message']) if (!chat.dataValues[k]) delete chat.dataValues[k]
        // })
        // console.log(miscReq)
        // if (miscReq.uniqueOnly=="true") {
        //     console.log('UNIQUE')
        //     miscReq.messages = "false"
        //     names = {}
        //     chats.reverse()
        //     chats.forEach(chat=>{
        //         if (names[chat.dataValues.user]===undefined) {
        //             chat.keep=true
        //             names[chat.dataValues.user] = true
        //         }
        //     }) 
        //     console.log(names)
        //     names = {}
        //     chats.reverse()
        //     chats.forEach(chat=>{
        //         if (names[chat.dataValues.user]===undefined) {
        //             chat.keep=true
        //             names[chat.dataValues.user] = true
        //         } 
        //     }) 
        //     console.log(names)
        //     chats = chats.filter(chat=>chat.keep)
        // }       

        // for (let k of ['messages', 'events']) if (miscReq[k]=='false') chats.filter(chat=>chat.dataValues[k])

        res.json({
            status: 200,
            data: chats
            });
    } catch (err) {
        console.error(err,Object.keys(err))
        res.json({
            status: 400,
            data: {
                    name: (err.name)?err.name:null,
                    detail: (err.original)?err.original.routine:null,
                    error: (err.original)?err.original.error:null,
                    sql: (err.sql)?err.sql:null
            }
        })
    }
})

module.exports=Router