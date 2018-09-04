var express = require('express')
var ws = require('ws')
var PORT = process.env.PORT || 3000
var path = '' || `c:/users/ryanm/git/wst/`
var server = express()

  .use((req, res) => res.sendFile(__dirname+'/index.html') )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


const wss = new ws.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
  });



setInterval(() => {
wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    });
}, 1000);


  