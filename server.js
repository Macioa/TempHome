var express = require('express')
var ws = require('ws')
var PORT = process.env.PORT || 3000
var server = express()
  .use((req, res) => res.sendFile(__dirname+'/index.html') )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


const wss = new ws.Server({ server });

wss.on('connection', (ws, req) => {
    console.log('Client connected', req.headers.origin);
    ws.on('close', () => console.log('Client disconnected'));
    ws.on('message', (message)=>{console.log(message)})
  });



setInterval(() => {
wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    });
}, 1000);


  