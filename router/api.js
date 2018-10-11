const express = require('express')
const Router = express.Router()

const processQuery = (queries) => {
    let returnQ = {}
    Object.keys(queries).forEach(key=>{
        returnQ[key]=queries[key].replace(/[^a-zA-Z0-9$]/g,'')
    })
    return returnQ
}

Router.get('/users', (req, res) => {
    console.log(processQuery(req.query))
    res.send('received')
})

Router.get('/logs', (req, res) => {
    
})

module.exports=Router