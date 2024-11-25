import * as THREE from 'three';
import { loadModel } from '../clases/modelLoader.js'

//import { createParticleSystem } from '../clases/particles.js';
import { createFireSystem } from '../clases/particles.js';

export function city(scene) {
    loadModel('./src/models/muebles_separados/arriba', 'arriba', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    //loadModel('./src/models/muebles_separados/centro', 'centro', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/derecha', 'derecha', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/izquierda', 'izquierda', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/muebles_separados/en_medio', 'en_medio', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)

    loadModel('./src/models/pizzeria/pizzeria', 'pizzeria', scene, { x: 0, y: Math.PI/2, z: 0 });
    //loadModel('./src/models/comida/Pizza', 'pizza', scene, { x: 0, y: 0, z: 0 }, { x: 0, y:2, z: 0 });

    const { particleSystem, particlesGeometry } = createFireSystem(10, 0.5, './src/particles/fire2.png');
    particleSystem.position.set(-0.2, 2.7, -8.7); // Ajusta la posición del fuego
    particleSystem.scale.set(0.5,0.01,0.5);// Ajusta la escala
    scene.add(particleSystem);

    return [particlesGeometry];

    //1
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
    
    loadModel('./src/models/playa_escenario/derecha_playa', 'derecha', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/playa_escenario/izquierda_playa', 'izquierda', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/playa_escenario/en_medio_playa', 'en_medio', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    //loadModel('./src/models/muebles_separados/centro', 'centro', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)

    loadModel('./src/models/playa_escenario/untitled', 'escenario', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, false, true);
    loadModel('./src/models/playa_escenario/carbon', 'carbon', scene, { x: 0, y: Math.PI/2, z: 0 });
    loadModel('./src/models/playa_escenario/cocos', 'cocos', scene, { x: 0, y: Math.PI/2, z: 0 });

    // Crear sistema de fuego
    const { particleSystem, particlesGeometry } = createFireSystem(100, 0.4, './src/particles/fire.png');
    particleSystem.position.set(1, 1.5, -8.7); // Ajusta la posición del fuego
    particleSystem.scale.set(1,0.2,0.5);// Ajusta la escala
    scene.add(particleSystem);

    return [particlesGeometry];
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

    
    loadModel('./src/models/minecraft/derecha', 'derecha', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/minecraft/izquierda', 'izquierda', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    loadModel('./src/models/minecraft/en_medio', 'en_medio', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    //loadModel('./src/models/minecraft/centro', 'centro', scene, { x: 0, y: Math.PI/2, z: 0 }, { x: 0, y: 0, z: 0 }, true)
    
    loadModel('./src/models/minecraft/minecraft', 'escenario', scene, { x: 0, y: Math.PI/2, z: 0 });

    const { particleSystem, particlesGeometry } = createFireSystem(5, 1, './src/particles/smoke_mine.png');
    particleSystem.position.set(0.4, 3, -8.3); // Ajusta la posición del fuego
    particleSystem.scale.set(1,1,1);// Ajusta la escala
    scene.add(particleSystem);

    return [particlesGeometry];

    //3
}
