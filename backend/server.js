// const WebSocket = require('ws');

// const server = new WebSocket.Server({
//   port: 8000,
// });

// let sockets = [];

// server.on('connection', (socket) => {
//   console.log('New client connected.');
//   socket.emit('connection', null);

//   // socket.on('join', (name) => {
//   //   console.log(`${name} joined the chat!`)
//   // });

//   // // Adicionamos cada nova conexão/socket ao array `sockets`
//   // sockets.push(socket);
//   // console.log('New Connection:', socket.origin);
//   // // Quando você receber uma mensagem, enviamos ela para todos os sockets
//   // socket.on('message', function(event) {
//   //   console.log('event:', event);

//   //   if(event.type === 'message') {
//   //     sockets.forEach(s => s.send(msg));
//   //   }
    
//   // });
//   // Quando a conexão de um socket é fechada/disconectada, removemos o socket do array
//   socket.on('close', function() {
//     console.log('Client disconnected.');
//     sockets = sockets.filter(s => s !== socket);
//     sockets.forEach(client => client.send(`${dateFormat(new Date(), 'HH:MM:ss')} - ${client} desconectado`));
//   });
// });

// ======================= Another way to do it =====================

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
  // console.log((dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss')) + ' Recieved a new connection from origin ' + request.origin + '.');

  const connection = request.accept(null, request.origin);
  // clients.push(connection);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

  connection.on('message', (msg) => {
    
    if (msg.type === 'utf8') {
      const dataFromClient = JSON.parse(msg.utf8Data);
      const type = dataFromClient.type;

      console.log('dataFromClient', dataFromClient);

      switch(type) {
        case 'login':
          users.push({
            id: userID,
            user: dataFromClient.user
          });
          sendJSONMessage('usersList', users );
          sendJSONMessage('message', `User ${dataFromClient.user} has joined the chat.` );
        case 'message':
          console.log('dataFromClient', dataFromClient);
          sendJSONMessage('message', dataFromClient.text );
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
    sendJSONMessage('message', `User ${user[0].user} has left the chat.` );
  });

});

const sendJSONMessage = (type, data) => {
  const jsonData = {
    type,
    data,
  }
  console.log('jsonData', jsonData);
  Object.keys(clients).map(client => {
    clients[client].send(JSON.stringify(jsonData));
  });
};