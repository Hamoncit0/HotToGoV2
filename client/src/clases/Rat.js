import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Rat { 
    constructor(scene, initialPosition = { x: 0, y: 2, z: 0 }) {
        this.scene = scene;
        this.speed = 0.05; // Velocidad para seguir al jugador
        this.stunDuration = 1; // Tiempo durante el cual el jugador queda atónito
        this.isStunned = false; // Si el jugador está atónito o no

        const loader = new GLTFLoader();
        loader.load('./src/models/cursed-rat/rat.gltf', (gltf) => {
            this.mesh = gltf.scene;
            this.scene.add(this.mesh);
            this.mesh.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
            this.mesh.scale.set(0.5, 0.5, 0.5);

            this.collisionBox = new THREE.Box3().setFromObject(this.mesh);

            this.animations = gltf.animations;

            if (this.animations && this.animations.length) {
                this.mixer = new THREE.AnimationMixer(this.mesh);
                this.animations.forEach((clip) => {
                    this.mixer.clipAction(clip).play();
                });
            }
        });
    }

    update(deltaTime, player, difficulty) {
        if (difficulty === 1 && !this.isStunned) {
            // Mover la rata hacia el jugador
            const direction = new THREE.Vector3().subVectors(player.mesh.position, this.mesh.position).normalize();
            this.mesh.position.add(direction.multiplyScalar(this.speed));

            // Actualizar la caja de colisión
            this.collisionBox.setFromObject(this.mesh);
        }

        if (this.mixer) {
            this.mixer.update(deltaTime);
        }

        // Comprobar si hay colisión con el jugador
        if (this.collisionBox.intersectsBox(player.collisionBox) && !this.isStunned) {
            this.stunPlayer(player);
            this.destroy(); // Eliminar la rata después de la colisión
        }
    }

    stunPlayer(player) {
        this.isStunned = true;
        player.stun(this.stunDuration); // Llamar al método de aturdir del jugador
        setTimeout(() => {
            this.isStunned = false;
        }, this.stunDuration * 1000);
    }

    destroy() {
        this.scene.remove(this.mesh); // Eliminar la rata de la escena
    }
    
}