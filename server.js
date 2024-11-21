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

io.on('connection', (socket) => {
  console.log('a user connected');

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
      console.log(`Actualización ${name}: ${player.x}, ${player.y}, ${player.z}`);
  
      // Emitir solo la actualización del jugador correspondiente
      io.emit('position', player, name);
    }
  });

  
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});