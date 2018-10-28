const express = require('express')
const Router = express.Router()

const bodyparser = require('body-parser')
Router.use(bodyparser.json())

const models = require('../models/')

const Authenticate = async (req,res,next)=>{
    try{
        let key = await models.key.find({where: {email:req.headers['auth-email']}})

        if (key&&(key.key===req.headers['auth-key'])){
            next();
        } else {
            res.json({
                status: 403,
                data: "Not authorized"
            })
        }
    } catch (err) {
        res.json({
            status: 400,
            data: err
        })
    }
}

Router.post('/newkey', (req,res)=>{
    let key = models.key.create(req.body).then(()=>{
        res.json({
          status: 200,
          data: `Key created for ${req.body.email}`
        });
    }).catch((err)=>{
        res.json({
            status: 400,
            data: err
        })
    })

})

Router.get('/getkey/:email', (req,res)=>{
    let key = models.key.find({ where: {email: req.params.email} }).then(key=>{
        if (key)
            res.json({
                status: 200,
                data: key.key
            })
        else res.json({
            status: 404,
            data: `Requested key not found for ${req.params.email}`
        })
    })
})

Router.use(Authenticate)

module.exports=Router