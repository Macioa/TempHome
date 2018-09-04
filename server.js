var express = require('express')
var ws = require('ws')
var PORT = process.env.PORT || 3000
var server = express()
  .use((req, res) => res.sendFile(__dirname+'/index.html') )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


const wss = new ws.Server({ server });

//broadcast server status to all connected clients
const broadcast = () =>{ wss.clients.forEach( (client)=> {

  var userlisthtml = '';
  for (let ip in users)
    if (users[ip].connected) userlisthtml+=(`<li class='userli'>${user[ip].name}</li>`);

  var loghtml = log.map(entry=>`<span class='username'>${users[entry.ip].name}: </span>` + entry.event?
                    `<span class='event'>${entry.event}</span>`
                    :
                    `<span class='message'>${entry.message}</span>`
  ).join()
  
  client.send( {'users':userlisthtml, 'log':loghtml} );
})}


//initialize global server vars
const users = {};
const log = [];


//set up connection event
wss.on('connection', (ws, req) => {
    //initialize connection
    let name = 'Guest';
    let ip = req.headers['x-forwarded-for'] || ws._socket.remoteAddress;

    if (users[ip]) users[ip].connected=true;
    else users[ip]={ 'name':name, 'connected':true }

    console.log('Client connected', ip);
    log.push({'ip':ip, 'event':'connected'})
    broadcast();

    //set up connection events
    ws.on('close', ()=> {
      console.log('Client disconnected', ip);
      users[ip].connected=false;
      log.push({'ip':ip, 'event':'disconnected'})
      broadcast();
    });

    ws.on('message', (data)=> {
      if (data.name!='') users[ip].name=data.name;
      log.push({'ip':ip, 'message':data.message})
      broadcast();
    })
  });



setInterval(() => {
wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    });
}, 1000);


  