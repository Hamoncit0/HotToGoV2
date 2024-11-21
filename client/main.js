import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//clases
import Player from './src/clases/Player.js'
import {ScreenController} from './src/clases/ScreenController.js';
import GameController from './src/clases/GameController.js';
import Rat from './src/clases/Rat.js'

//import Item from './src/clases/Item.js';
import Dispenser from './src/clases/Dispenser.js';

//socket
const socket = io();
var player1Name = '';
var player2Name = '';


// Configuración básica
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x777777);

//Cámara
const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = -1;
camera.position.y = 6;
camera.lookAt(new THREE.Vector3(0, 2, -5)); 

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

let clock = new THREE.Clock(); // Reloj para medir el tiempo

const localPlayer = new Player(scene, './src/models/players/player_1v4.gltf', { x: 0, y: 2, z: -2 });

//Controlador de pantallas
const gameController = new GameController(scene, localPlayer, socket);

const screenController = new ScreenController(container, renderer, clock, animate, scene, camera, gameController, socket);
gameController.loadDeliveryZone('./src/models/delivertable/table.obj', './src/models/delivertable/table.mtl', { x: -4, y: 1.5, z: -.8 });
gameController.loadDeliveryZone('./src/models/delivertable/table.obj', './src/models/delivertable/table.mtl', { x: 3, y: 1.5, z: -.8 });

//sirve para generar ordenes cada cierto tiempo 1000 = 1sec
setInterval(() => {
  if (gameController.isPlaying) {
      gameController.generateOrder();
  }
}, gameController.orderFrequency);
// Ajuste de ventana
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

const speed = 0.3;
const keyboard = {};
document.addEventListener('keydown', (event) => {
  keyboard[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  keyboard[event.key] = false;
});
let colisionado = false;
let collisionCooldown = 10000

// Crear un array para los dispensers
const dispensers = [];
const remotePlayers = {}; // Almacena a los jugadores remotos

// Agregar dispensers al array
dispensers.push(new Dispenser(scene, { x: -4, y: 2, z: -6 }, camera, 'Pizza'));
dispensers.push(new Dispenser(scene, { x: -2, y: 2, z: -6 }, camera, 'Risoto'));
dispensers.push(new Dispenser(scene, { x: 0, y: 2, z: -6 }, camera, 'Lasagna'));
dispensers.push(new Dispenser(scene, { x: 2, y: 2, z: -6 }, camera, 'Agua'));
// Agrega los power-ups a un array global o del controlador
// Crear el jugador y el tag de nombre
const playerNameTag = createPlayerNameTag(localPlayer);


//socket.io

// socket.on('start', (name) => {
//   console.log('Jugador conectado:', name);
//   if (name !== localPlayer.name && screenController.isGameRunning && screenController.playerModeSelected == 1) {
//     player2Name = name;

//     // Crea un nuevo jugador remoto
//     const remotePlayer = new Player(scene, './src/models/players/player_2.gltf', { x: 2, y: 2, z: -2 });
//     remotePlayer.name = name;
//     remotePlayers[name] = remotePlayer;

//     console.log(`Jugador remoto ${name} añadido`);
//   }
// });
var isHost = false;
var hostInterval;
function startHostResponsibilities(roomState) {
  // Inicializar datos si es necesario
  gameController.timeRemaining = roomState?.timeRemaining || 120;

  // Empezar a manejar el tiempo de la partida
  hostInterval = setInterval(() => {
    gameController.timeRemaining -= 1;

    // Enviar actualizaciones al servidor cada segundo
    this.socket.emit('hostUpdate', screenController.room, { timeRemaining: gameController.timeRemaining });

    if (gameController.timeRemaining <= 0) {
      clearInterval(hostInterval);
      console.log('¡La partida ha terminado!');
    }
  }, 1000);
}
socket.on('gameUpdate', (data) => {
  if (data.timeRemaining !== undefined) {
    gameController.timeRemaining = data.timeRemaining;
  }
});

socket.on('newHost', () => {
  isHost = true;
  console.log('¡Ahora soy el nuevo host!');
  startHostResponsibilities();
});

socket.on('roomInit', (roomState) => {
  const { players, objects } = roomState;
  if (data.isHost) {
    isHost = true; // Bandera para verificar si el jugador es host
    startHostResponsibilities(data.roomState);
  }
  // Renderizar jugadores
  Object.entries(players).forEach(([id, player]) => {
    if (player.name !== localPlayer.name) {
      player2Name = player.name;
    
      // Crea un nuevo jugador remoto
      const remotePlayer = new Player(scene, './src/models/players/player_2.gltf', { x: 2, y: 2, z: -2 });
      remotePlayer.name = player.name;
      remotePlayers[player.name] = remotePlayer;
  
      console.log(`Jugador remoto ${player.name} añadido`);
    }
  });

  // Renderizar objetos
  objects.forEach((object) => this.addObjectToScene(object));
});

// Nuevo jugador en la sala
socket.on('newPlayer', (data) => {
  if (data.player.name !== localPlayer.name && screenController.isGameRunning && screenController.playerModeSelected == 1) {
        player2Name = data.player.name;
    
        // Crea un nuevo jugador remoto
        const remotePlayer = new Player(scene, './src/models/players/player_2.gltf', { x: 2, y: 2, z: -2 });
        remotePlayer.name = data.player.name;
        remotePlayers[data.player.name] = remotePlayer;
    
        console.log(`Jugador remoto ${data.player.name} añadido`);
  }
});

// Evento para actualizar la posición de jugadores remotos
socket.on('position', (position, name) => {
  if (remotePlayers[name]) {
    remotePlayers[name].mesh.position.set(position.x, position.y, position.z);
    //console.log(`Posición de ${name} actualizada:`, position);
  }
});

socket.on('start_success', (name, playersList) => {
  player1Name = name;
  console.log(`Conectado como: ${player1Name}`);
  playersList.forEach((p) => console.log(`Jugador en partida: ${p.name}`));
});

socket.on('new_player', (name) => {
  console.log(`Nuevo jugador conectado: ${name}`);
});

setInterval(() => {
  if (localPlayer && gameController.isPlaying) {
    //console.log(localPlayer.name)
    socket.emit('position', localPlayer.mesh.position, localPlayer.name);
  }
}, 100); // 10 veces por segundo

function animate(isGameRunning, isGamePaused) {

    if (!isGameRunning || isGamePaused) return;

    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();


     if (keyboard['w'] || keyboard['W']) localPlayer.move(0, 0, -speed);
     if (keyboard['s'] || keyboard['S']) localPlayer.move(0, 0, speed);
     if (keyboard['a'] || keyboard['A']) localPlayer.move(-speed, 0, 0);
     if (keyboard['d'] || keyboard['D']) localPlayer.move(speed, 0, 0);

    //  if (!localPlayer.mesh.position.equals(localPlayer.previousPosition)) {
    //   socket.emit('position', localPlayer.mesh.position, player1Name);
    //   localPlayer.previousPosition.copy(localPlayer.mesh.position); // Actualizar la posición anterior
    //  }

    scene.children.forEach((object) => {
        if (object.collisionBox && checkCollision(localPlayer, object)) {
            localPlayer.revertPosition()
        }
    }); 
    
    // Renderiza a los jugadores remotos
    Object.values(remotePlayers).forEach((remotePlayer) => {
      remotePlayer.update(deltaTime); // Si `Player` tiene lógica de animación
    });

	// Interacción con dispensers al presionar teclas
    window.addEventListener('keyup', (event) => {
      dispensers.forEach((dispenser) => {
         if (event.key === 'f' && dispenser.canDispense && dispenser.isNear(localPlayer)) {
                dispenser.dispenseItem(); // Genera un ítem del dispenser
            } else if (event.key === 'e' && !localPlayer.heldObject) {
                dispenser.items.forEach((item) => localPlayer.pickUpObject(item));
            } else if (event.key === 'e' && localPlayer.heldObject) {
                localPlayer.dropObject();
          }
      });
      if(event.key == 'j'){
        console.log(localPlayer.mesh.position)
      }
  
    });

    // Actualiza la posición del tag del nombre
    updatePlayerNameTag(playerNameTag, localPlayer, camera);

    // Actualizar cada dispenser
    dispensers.forEach((dispenser) => dispenser.update());

    localPlayer.update(deltaTime);

    gameController.update();

    renderer.render(scene, camera);
}

function checkCollision(player1, object) {
  return player1.collisionBox.intersectsBox(object.collisionBox);
}


function createPlayerNameTag(player) {
  // Crea un elemento div para el nombre
  const nameTag = document.createElement('div');
  nameTag.textContent = player.name;
  nameTag.style.position = 'absolute';
  nameTag.style.color = 'black';
  nameTag.style.fontSize = '14px';
  nameTag.style.textAlign = 'center';

  // Añádelo al contenedor de nombres
  document.getElementById('player-names-container').appendChild(nameTag);

  return nameTag;
}

function updatePlayerNameTag(nameTag, player, camera) {
  nameTag.textContent = player.name;
  // Proyecta la posición 3D a coordenadas de pantalla
  const vector = new THREE.Vector3(player.mesh.position.x - 0.05 , player.mesh.position.y + 2.22, player.mesh.position.z); // +2 para colocarlo encima
  vector.project(camera);

  // Convierte las coordenadas normalizadas a pixeles
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

  // Actualiza la posición del div
  nameTag.style.left = `${x}px`;
  nameTag.style.top = `${y}px`;
}
