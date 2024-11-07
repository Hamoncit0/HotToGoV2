import * as THREE from 'three';
import { loadModel } from '../clases/modelLoader.js'
import Item from '../clases/Item.js';

export function city(scene) {
    loadModel('./src/models/muebles_separados/arriba', 'arriba', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/centro', 'centro', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/derecha', 'derecha', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/izquierda', 'izquierda', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/en_medio', 'en_medio', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)

    loadModel('./src/models/pizzeria/pizzeria', 'pizzeria', scene, { x: 0, y: Math.PI/2, z: 0 });
    //loadModel('./src/models/comida/Pizza', 'pizza', scene, { x: 0, y: 0, z: 0 }, { x: 0, y:2, z: 0 });
   
}

export function beach(scene) {
 
    // Load Skydome Texture
    const textureLoader = new THREE.TextureLoader();
    const skyTexture = textureLoader.load('./src/models/playa_escenario/sunny_day_at_the_beach.jpg');

    // Create the Skydome Geometry (Inverted Sphere)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const material = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide, // Render the inside of the sphere
    });
    const skydome = new THREE.Mesh(geometry, material);
    scene.add(skydome);
    loadModel('./src/models/muebles_separados/centro', 'centro', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/derecha', 'derecha', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/izquierda', 'izquierda', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/en_medio', 'en_medio', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)


    loadModel('./src/models/playa_escenario/escenario', 'escenario', scene, { x: 0, y: Math.PI/2, z: 0 });
}

export function minecraft(scene) {
 
    // Load Skydome Texture
    const textureLoader = new THREE.TextureLoader();
    const skyTexture = textureLoader.load('./src/models/minecraft/background.jpeg');

    // Create the Skydome Geometry (Inverted Sphere)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const material = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide, // Render the inside of the sphere
    });
    const skydome = new THREE.Mesh(geometry, material);
    scene.add(skydome);

    loadModel('./src/models/muebles_separados/centro', 'centro', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/derecha', 'derecha', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/izquierda', 'izquierda', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/en_medio', 'en_medio', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)


    loadModel('./src/models/minecraft/minecraft', 'escenario', scene, { x: 0, y: Math.PI/2, z: 0 });
}