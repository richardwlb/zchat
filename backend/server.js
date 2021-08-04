const http = require('http');
const webSocketServer = require('websocket').server;
const dateFormat = require('dateformat');
const uuid = require('uuid');

const server = http.createServer();
const webSocketServerPort = 8000;
server.listen(webSocketServerPort);

const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = {};
let users = [];

wsServer.on('request', (request) => {
  const userID = uuid.v1();
  
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

  connection.on('message', (msg) => {
    if (msg.type === 'utf8') {
      const dataFromClient = JSON.parse(msg.utf8Data);
      const type = dataFromClient.type;

      // console.log('dataFromClient', dataFromClient);

      switch(type) {
        case 'login':
          users.push({
            id: userID,
            user: dataFromClient.user
          });
          sendJSONMessage('usersList', users );
          // sendJSONMessage('message', `User ${dataFromClient.user} has joined the chat.` );
          sendJSONMessage('message', {
            user: dataFromClient.user,
            text: 'has joined the chat.'
          });
        case 'message':
          console.log('dataFromClient ===>', dataFromClient);

          const user = users.filter(user => user.id === userID);

          if(dataFromClient.text && user[0]?.user) {
            sendJSONMessage('message', {
              user: user[0].user,
              text: dataFromClient.text
            });
          }
      }
      
    }
    // console.log(msg)
    // clients.forEach(client => client.send(msg.utf8Data));
  });

  connection.on('close', function(connection) {
    console.log((dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss')) + " Peer " + userID + " disconnected.");

    const user = users.filter(user => user.id === userID);
    
    users = users.filter( user => user.id !== userID);
    const data = {
      type: 'usersList',
      users,
    }

    delete clients[userID];
    
    sendJSONMessage('usersList', users );
    sendJSONMessage('message', {
      user: user[0]?.user,
      text: 'has left the chat.'
    });
  });

});

const sendJSONMessage = (type, data) => {
  const jsonData = {
    type,
    data,
  }
  // console.log('jsonData', jsonData);
  Object.keys(clients).map(client => {
    clients[client].send(JSON.stringify(jsonData));
  });
};