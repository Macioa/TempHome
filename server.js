var express = require('express')
var ws = require('ws')
var PORT = process.env.PORT || 3000
var server = express()
  .get('/',(req, res) => res.sendFile(__dirname+'/index.html') )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


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
  let date = new Date();
  date = (date.getHours()%12+4)+'<span>&#58</span>'+date.getMinutes()+'<span>&#58</span>'+date.getSeconds()
  return date
}

//initialize global server vars
const users = {};
const log = [];
var guestCount=0;


//set up connection event
wss.on('connection', (ws, req) => {
    //initialize connection
    let ip = req.headers['x-forwarded-for'] || ws._socket.remoteAddress;


    if (users[ip]) users[ip].connected=true;
    else {
      let name = `Guest${guestCount}`; guestCount++;
      users[ip]={ 'name':name, 'connected':true }
    }

    console.log('Client connected', ip);

    log.push({'ip':ip, 'event':'Connected', 'time':getTime()})
    broadcast();

    //set up connection events
    ws.on('close', ()=> {
      console.log('Client disconnected', ip);
      users[ip].connected=false;

      log.push({'ip':ip, 'event':'Disconnected', 'time':getTime()})
      broadcast();
    });

    ws.on('message', (data)=> {
      data = JSON.parse(data)
      if (data.name!='') users[ip].name=data.name;
      console.log(ip, data.message)

      log.push({'ip':ip, 'message':data.message, 'time':getTime()})
      broadcast();
    })
  });



setInterval(() => {
wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    });
}, 1000);


  