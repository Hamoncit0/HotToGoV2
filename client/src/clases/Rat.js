import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import AudioManager from './AudioManager.js';

export default class Rat {
	constructor(scene, initialPosition = { x: 0, y: 2, z: 0 }, audioManager) {
		this.scene = scene;
		this.speed = 0.05; // Velocidad para seguir al jugador
		this.stunDuration = 2; // Tiempo durante el cual el jugador queda atónito
		this.isSoundPlaying = false;
        this.audioManager = audioManager;

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
		if (difficulty === 1) {
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
		if (this.collisionBox.intersectsBox(player.collisionBox)) {
			player.stun(this.stunDuration); // Llamar al método de aturdir del jugador
			this.destroy(); // Eliminar la rata de la escena
		}

        // Verificar si la rata está en pantalla
        this.checkVisibilityAndPlaySound();
	}

	checkVisibilityAndPlaySound() {
        if (!this.mesh) return;

            // Si la rata está en el campo de visión, reproducir el sonido
            if (!this.isSoundPlaying) {
                this.audioManager.playSound('ratVisible');
                this.isSoundPlaying = true;
			}else{

			}
    }


	// Método para destruir el objeto
	destroy() {
		if (this.mesh) {
			// Eliminar el objeto de la escena
			this.scene.remove(this.mesh);

			// Recorrer y liberar geometría y materiales
			this.mesh.traverse((child) => {
				if (child.isMesh) {
					child.geometry.dispose();
					if (Array.isArray(child.material)) {
						child.material.forEach((material) => material.dispose());
					} else {
						child.material.dispose();
					}
				}
			});

			if (this.isSoundPlaying) {
                this.audioManager.stopSound('ratVisible');
                this.isSoundPlaying = false;
            }
			// Eliminar referencias
			this.mesh = null;
			this.collisionBox = null;
		}
	}
}