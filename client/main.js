import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//clases
import Player from './src/clases/Player.js'
import {ScreenController} from './src/clases/ScreenController.js';
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
const screenController = new ScreenController(container, renderer, clock, animate, scene, camera);

// Ajuste de ventana
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
const speed = 0.6;
const keyboard = {};
document.addEventListener('keydown', (event) => {
  keyboard[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  keyboard[event.key] = false;
});
let colisionado = false;
let collisionCooldown = 10000
const dispenser = new Dispenser(scene, {x: -2, y: 2.5, z: -2});
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
		if (event.key === 'f' && dispenser.canDispense && dispenser.isNear(localPlayer)) { // Presiona "f" para generar una pizza
		  dispenser.dispenseAgua();
		} else if (event.key === 'e' && !localPlayer.heldObject) { // Presiona "e" para recoger la pizza más cercana
		  dispenser.items.forEach(pizza => localPlayer.pickUpObject(pizza));
		}
    else if(event.key === 'e' && localPlayer.heldObject){
      localPlayer.dropObject();
    }
	  });

    renderer.render(scene, camera);
}

function checkCollision(player1, object) {
  return player1.collisionBox.intersectsBox(object.collisionBox);
}
