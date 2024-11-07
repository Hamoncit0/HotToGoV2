import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//clases
import Player from './src/clases/Player.js'
import {ScreenController} from './src/clases/ScreenController.js';
import Item from './src/clases/Item.js';

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

const controls = new OrbitControls(camera, renderer.domElement);


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
const speed = 0.10;
const keyboard = {};
document.addEventListener('keydown', (event) => {
  keyboard[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  keyboard[event.key] = false;
});
let colisionado = false;
let collisionCooldown = 10000
const apple = new Item(scene, './src/models/comida/Pizza', { x: -2, y: 2.5, z: -2 });
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

    if (apple.isNear(localPlayer)) {
      console.log('huh')
      localPlayer.pickUpObject(apple);
    }

    renderer.render(scene, camera);
}

function checkCollision(player1, object) {
  return player1.collisionBox.intersectsBox(object.collisionBox);
}
