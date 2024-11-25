const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const mysql = require('mysql2');


const app = express();
const server = createServer(app);
const io = new Server(server);


app.use('/client',express.static( join(__dirname, '/client')))
app.use('/models',express.static( join(__dirname, 'models')))
app.use('/src',express.static( join(__dirname, '/client/src')))
app.use('/imagenes', express.static(join(__dirname, 'client/imagenes')));
app.use('/scss', express.static(join(__dirname, 'client/scss')));
app.use(express.static(join(__dirname, 'client')));
app.use(express.json()); // Para procesar JSON en las solicitudes

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db_hottogo',
});


// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/client/index.html'));
});
// Rutas de la API REST para los high scores
app.get('/api/highscores', (req, res) => {
  const query = 'SELECT name, score FROM highscore ORDER BY score DESC LIMIT 5';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los datos:', err);
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }
    res.json(results);
  });
});

app.post('/api/highscores', (req, res) => {
  const { name, score } = req.body;

  const selectQuery = 'SELECT score FROM highscore WHERE name = ?';
  db.query(selectQuery, [name], (err, results) => {
    if (err) {
      console.error('Error al buscar el highscore:', err);
      return res.status(500).json({ error: 'Error al buscar el highscore' });
    }

    if (results.length > 0) {
      const currentScore = results[0].score;
      if (score > currentScore) {
        const updateQuery = 'UPDATE highscore SET score = ? WHERE name = ?';
        db.query(updateQuery, [score, name], (err) => {
          if (err) {
            console.error('Error al actualizar el highscore:', err);
            return res.status(500).json({ error: 'Error al actualizar el highscore' });
          }
          res.json({ message: 'Highscore actualizado' });
        });
      } else {
        res.json({ message: 'El nuevo score no es mayor al actual' });
      }
    } else {
      const insertQuery = 'INSERT INTO highscore (name, score) VALUES (?, ?)';
      db.query(insertQuery, [name, score], (err) => {
        if (err) {
          console.error('Error al insertar el highscore:', err);
          return res.status(500).json({ error: 'Error al insertar el highscore' });
        }
        res.json({ message: 'Highscore registrado' });
      });
    }
  });
});


const players=[];
const rooms=[];
const objects = [];
let orders = [];
let scores = {};

io.on('connection', (socket) => {
  console.log('Jugador conectado:', socket.id);

  socket.on('loseLife', (roomName) => {
    const room = rooms[roomName];
    if (room) {
      room.lives -= 1;
      io.to(roomName).emit('livesUpdate', room.lives);
      console.log('en sala: ' + room.name + 'quedan: ' + room.lives)
      if (room.lives <= 0) {
        io.to(roomName).emit('gameOver');
      }
    }
  });
  
    // Enviar órdenes y puntuación iniciales al jugador
  socket.emit('ordersUpdate', orders);
  socket.emit('scoreUpdate', scores[socket.id] || 0);

    // Escuchar actualizaciones de órdenes
  socket.on('updateOrders', (updatedOrders) => {
      orders = updatedOrders;
      io.emit('ordersUpdate', orders); // Actualizar para todos los jugadores
  });
 
  socket.on('updateScore', (points) => {
        scores[socket.id] = points;
        io.emit('scoreUpdate', points); // Actualizar para todos los jugadores
  });
   // Manejar desconexión
   socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
    delete scores[socket.id];
  });


  socket.on('joinRoom', (roomName, playerData, gameSettings) => {
    if (!rooms[roomName]) {
      // Crear la sala si no existe
      rooms[roomName] = {
        players: {},
        objects: [],
        host: socket.id, // El primer jugador será el host
        timeRemaining: 120,
        lives: 3, 
        settings: {
          gameMode: gameSettings.gameMode,
          difficulty: gameSettings.difficulty,
          mapSelected: gameSettings.mapSelected,
        }
      };
    }else if (!rooms[roomName].host) {
      // Asignar host si no hay uno (fallback)
      rooms[roomName].host = socket.id;
    }


    // Agregar al jugador a la sala
    rooms[roomName].players[socket.id] = {
      name: playerData.name,
      position: playerData.position || { x: 0, y: 0, z: 0 },
      score: 0,
    };

    socket.join(roomName);

    // Enviar al jugador el estado inicial de la sala
    //socket.emit('roomInit', rooms[roomName]);
    socket.emit('roomInit', {
      roomState: rooms[roomName],
      lives: rooms[roomName].lives,
      isHost: socket.id === rooms[roomName].host // Informar si es el host
    });

    // Avisar a los demás en la sala que un nuevo jugador se unió
    socket.to(roomName).emit('newPlayer', {
      id: socket.id,
      player: rooms[roomName].players[socket.id],
    });

    console.log(`Jugador ${playerData.name} se unió a la sala: ${roomName}`);
  });

   // Cuando el host envía datos actualizados
   socket.on('hostUpdate', (roomName, updateData) => {
    const room = rooms[roomName];
    if (room && socket.id === room.host) {
      // Actualizar el tiempo restante en el servidor
      if (updateData.timeRemaining !== undefined) {
        room.timeRemaining = updateData.timeRemaining;
      }
  
      // Enviar los datos a los demás jugadores
      socket.to(roomName).emit('gameUpdate', { timeRemaining: room.timeRemaining });
    }
  });
  
  socket.on('gameSettingsUpdate', (settings) => {
    const room = Object.keys(rooms).find((room) => rooms[room].players[socket.id]);
    if (room && rooms[room].host === socket.id) {
        rooms[room].settings = settings;
        io.to(room).emit('gameSettingsUpdate', settings); // Broadcast to all players
        console.log(`Updated game settings for room ${room}:`, settings);
    }
  });


  // Actualizar posición del jugador
  socket.on('updatePosition', (roomName, position) => {
    if (rooms[roomName] && rooms[roomName].players[socket.id]) {
      rooms[roomName].players[socket.id].position = position;

      // Emitir actualización solo a los jugadores de la sala
      socket.to(roomName).emit('updatePlayer', { id: socket.id, position });
    }
  });

  // Desconexión del jugador
  socket.on('disconnect', () => {
    for (const roomName in rooms) {
      const room = rooms[roomName];
      const playerName = room.players[socket.id].name; 

      if (room.players[socket.id]) {
        // Si el host se desconecta, asignar nuevo host
        if (room.host === socket.id) {
          const remainingPlayers = Object.keys(room.players).filter(
            (id) => id !== socket.id
          );
          room.host = remainingPlayers[0] || null;
          if (room.host) {
            io.to(room.host).emit('newHost'); // Informar al nuevo host
          }
        }

        // Eliminar al jugador de la sala
        delete room.players[socket.id];
        io.to(roomName).emit('playerLeft', { id: socket.id });
        io.to(roomName).emit('playerDisconnected', { name: playerName });

        // Eliminar la sala si ya no tiene jugadores
        if (Object.keys(room.players).length === 0) {
          delete rooms[roomName];
        }
        break;
      }
    }
  });

  socket.on('start', (name) => {
    console.log('start name: ' + name);

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
    const player = players.find((p) => p.name == name);
    if (player) {
      player.x = position.x;
      player.y = position.y;
      player.z = position.z;
      //console.log(`Actualización ${name}: ${player.x}, ${player.y}, ${player.z}`);
  
      // Emitir solo la actualización del jugador correspondiente
      io.emit('position', player, name);
    }
  });

  
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});