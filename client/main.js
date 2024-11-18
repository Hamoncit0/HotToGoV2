import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//clases
import Player from './src/clases/Player.js'
import {ScreenController} from './src/clases/ScreenController.js';
import GameController from './src/clases/GameController.js';

//import Item from './src/clases/Item.js';
import Dispenser from './src/clases/Dispenser.js';

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
const gameController = new GameController(scene, localPlayer);

const screenController = new ScreenController(container, renderer, clock, animate, scene, camera, gameController);
gameController.loadDeliveryZone('./src/models/delivertable/table.obj', './src/models/delivertable/table.mtl', { x: -4, y: 1.5, z: -.8 });
gameController.loadDeliveryZone('./src/models/delivertable/table.obj', './src/models/delivertable/table.mtl', { x: 3, y: 1.5, z: -.8 });

//sirve para generar ordenes cada cierto tiempo 1000 = 1sec
setInterval(() => {
  if (gameController.isPlaying) {
      gameController.generateOrder();
  }
}, 10000);
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


const dispenser = new Dispenser(scene, {x: -4, y: 2, z: -6}, camera, 'Pizza');
const dispenserLasagna = new Dispenser(scene, {x: -2, y: 2, z: -6}, camera, 'Risoto');


function animate(isGameRunning, isGamePaused) {


    if (!isGameRunning || isGamePaused) return;

    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();

     localPlayer.update(deltaTime);

     if (keyboard['w'] || keyboard['W']) localPlayer.move(0, 0, -speed);
     if (keyboard['s'] || keyboard['S']) localPlayer.move(0, 0, speed);
     if (keyboard['a'] || keyboard['A']) localPlayer.move(-speed, 0, 0);
     if (keyboard['d'] || keyboard['D']) localPlayer.move(speed, 0, 0);

     scene.children.forEach((object) => {
      if (object.collisionBox && checkCollision(localPlayer, object)) {
          localPlayer.revertPosition()
      }
    });

	window.addEventListener('keyup', (event) => {
		if (event.key === 'f' && dispenserLasagna.canDispense && dispenserLasagna.isNear(localPlayer)) { // Presiona "f" para generar una pizza
		  dispenserLasagna.dispenseItem();
		} else if (event.key === 'e' && !localPlayer.heldObject) { // Presiona "e" para recoger la pizza más cercana
		  dispenserLasagna.items.forEach(pizza => localPlayer.pickUpObject(pizza));
		}
    else if(event.key === 'e' && localPlayer.heldObject){
      localPlayer.dropObject();
    }
	  });

    gameController.update();
    dispenserLasagna.update();
    renderer.render(scene, camera);
}

function checkCollision(player1, object) {
  return player1.collisionBox.intersectsBox(object.collisionBox);
}
