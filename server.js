const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const players=[];

const app = express();
const server = createServer(app);
const io = new Server(server);


app.use('/client',express.static( join(__dirname, '/client')))
app.use('/models',express.static( join(__dirname, 'models')))
app.use('/src',express.static( join(__dirname, '/client/src')))
app.use('/imagenes', express.static(join(__dirname, 'client/imagenes')));
app.use('/scss', express.static(join(__dirname, 'client/scss')));
app.use(express.static(join(__dirname, 'client')));


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/client/index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('start', (name) => {
    console.log('start name: '+name);

    players.push( {
    name:name,
    x:2,
    y:2,
    z:-2
  });
  
  for(let item of players){
    
   io.emit('start',item.name);

  }

  });

  socket.on('position', (position, name) => {
    const player = players.find((p) => p.name === name);
    if (player) {
      player.x = position.x;
      player.y = position.y;
      player.z = position.z;
      console.log(`Actualización ${name}: ${player.x}, ${player.y}, ${player.z}`);
  
      // Emitir solo la actualización del jugador correspondiente
      io.emit('position', player, name);
    }
  });

  
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});