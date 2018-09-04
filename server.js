var express = require('express')
var ws = require('ws')
var PORT = process.env.PORT || 3000
var server = express()
  .use((req, res) => res.sendFile(__dirname+'/index.html') )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


const wss = new ws.Server({ server });
const broadcast = (data) =>{ wss.clients.forEach((client)=> {

})}

const users = {};
const log = [];

wss.on('connection', (ws, req) => {
    let name = 'Guest';
    let ip = req.headers['x-forwarded-for'] || ws._socket.remoteAddress;

    console.log('Client connected', ip);

    ws.on('close', ()=> {console.log('Client disconnected', ip)});

    ws.on('message', (message)=> {console.log(message)})
  });



setInterval(() => {
wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    });
}, 1000);


  