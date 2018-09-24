const express = require('express')
const router = express.Router()

const sequelize = require('../db')

const UserModel = require('../models/user')
const ChatModel = require('../models/chat')

const Users = new UserModel(sequelize)
const Chats = new ChatModel(sequelize)

router.test=function(test){console.log(test)}
router.test('1')
module.exports=router