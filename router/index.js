const express = require('express')
const router = express.Router()

const chalk = require('chalk')

const models = require('../models/')

const mailer = require('../mailer')

router.addUser = async(inputUser, login=true) => {
    try{
        let user = await models.user.findOne({ where: {ip: inputUser.ip} })
        if (!user) {
            user = await models.user.create(Object.assign(inputUser,{names:[inputUser.name]})).then(user=>console.log(chalk.green(`Created new user with ${user.ip}`))).catch(err=>console.error(chalk.red(err)))
            if (login&&user)
                mailer(`Log in from new user. ${user.ip}`,JSON.stringify(user))
        } else {
            let isNew = true, nameChanged=false
            user.names.forEach(existingName=>{if (inputUser.name==existingName) isNew=false})
            if (user.recentName!=inputUser.name)
                { nameChanged=true; user.recentName=inputUser.name }
            if (isNew){ user.names.push(inputUser.name) }

            if (isNew&&nameChanged){
                user.update({ ip: user.ip, recentName: user.recentName, names: user.names}, {fields: ['names','recentName']}).then(()=>console.log(chalk.green(`Updated new name for user ${user.ip}`)))
            } else if (isNew){
                user.update({ ip: user.ip, recentName: user.recentName, names: user.names}, {fields: ['names']}).then(()=>console.log(chalk.green(`Added name to user ${user.ip}`)))
            } else if (nameChanged)
                user.update({ ip: user.ip, recentName: user.recentName, names: user.names}, {fields: ['recentName']}).then(()=>console.log(chalk.green(`Modified current name for user ${user.ip}`)))
            if (login)
                mailer(`Log in from existing user. ${user.ip}`,JSON.stringify(user))
        }
    } catch(err){ console.error(chalk.red(err)) }
}

router.getName = async (ip) =>{
    try {
        let user = await models.user.findOne({ where: {ip: ip} })
        if (user)
            return user.recentName
        else return null
    } catch (err) { console.error(chalk.red(err)); return null }
}

router.addChat = async (chat) => {
    try {
        let chatresult = await models.chat.create(chat)
        if (chatresult) {
            console.log(chalk.green(`Logged "${chat.message||chat.event}" from ${chat.ip}`))
            if (!chatresult.event)
                mailer(`Message from user ${chat.ip}-> ${chat.message}`,JSON.stringify(chatresult))
        }
    } catch(err) { console.error(chalk.red(err)) }
}

router.logOut = async (ip)=> {
    let user = await models.user.findOne({ where: {ip: ip} })
    mailer(`Logout ${ip}`,JSON.stringify(user))
}

module.exports=router