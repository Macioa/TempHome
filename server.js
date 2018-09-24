const express = require('express')
const ws = require('ws')
var PORT = process.env.PORT || 3000

const chalk = require('chalk')

router = require('./router')


var server = express()
  .get('/',(req, res) => res.sendFile(__dirname+'/index.html') )
  .listen(PORT, () => console.log(chalk.green(`Listening on ${ PORT }`)))

const { DateTime } = require('luxon');


const wss = new ws.Server({ server });

//broadcast server status to all connected clients
const broadcast = () =>{ wss.clients.forEach( (client)=> {

  var userlisthtml = '';
  for (let ip in users)
    if (users[ip].connected) userlisthtml+=(`<li class='userli'>${users[ip].name}</li>`);

  var loghtml = log.map(entry=>`<span class='username'>${users[entry.ip].name} </span>` + 
                  `<span class='time'>|${entry.time}|</span> &#187   ` +
                  (entry.event?
                    `<span class='event'>${entry.event}</span>`
                    :
                    `<span class='message'>${entry.message}</span>`) +
                    '<br/>'
  ).join().replace(/,/g,'')
  
  client.send( JSON.stringify({'users':userlisthtml, 'log':loghtml}) );
})}

const getTime=()=>{
  var date = DateTime.local().setZone('America/Chicago')
  return date.toLocaleString(DateTime.TIME_WITH_SECONDS)
}

//initialize global server vars
const users = {};
const log = [];
var guestCount=0;


//set up connection event
wss.on('connection', async (ws, req) => {
    //initialize connection
    let ip = req.headers['x-forwarded-for'] || ws._socket.remoteAddress;


    if (users[ip]) users[ip].connected=true;
    else {
      let name = await router.getName(ip)||`Guest${guestCount}`; 
      guestCount++;
      users[ip]={ 'name':name, 'connected':true }
    }

    console.log(chalk.yellow('Client connected', ip))

    let event = {'ip':ip, 'event':'Connected', 'time':getTime()}
    log.push(event)
    router.addChat(event)
    router.addUser({ip:ip,name:users[ip].name})
    broadcast();

    //set up connection events
    ws.on('close', ()=> {
      console.log(chalk.yellow('Client disconnected', ip))
      users[ip].connected=false;

      let event = {'ip':ip, 'event':'Disconnected', 'time':getTime()}
      log.push(event)
      router.addChat(event)
      router.logOut(ip)
      broadcast();
    });

    ws.on('message', (data)=> {
      data = JSON.parse(data)
      if (data.name!='') {
        users[ip].name=data.name
        router.addUser({ip:ip, name:data.name},false)
      }
      console.log(ip, data.message)

      let message = {'ip':ip, 'message':data.message, 'time':getTime()}
      log.push(message)
      router.addChat(message)
      broadcast();
    })
  });



setInterval(() => {
wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    });
}, 1000);


  