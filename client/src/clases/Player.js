import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Player {
  constructor(scene, modelPath, initialPosition = { x: 0, y: 2, z: 0 }, name="player1") {
    this.scene = scene;
    this.name = name;
    this.heldObject = null; // Objeto que el jugador está sosteniendo
    this.actionInProgress = false; // Controla si una acción está en progreso
    this.speedMultiplier = 1; // Velocidad inicial
	this.isStunned = false; // Para evitar que el jugador sea aturdido múltiples veces rápidamente

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      this.mesh = gltf.scene;
      this.scene.add(this.mesh);
      this.mesh.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
      this.mesh.scale.set(0.5, 0.5, 0.5);

      this.collisionBox = new THREE.Box3().setFromObject(this.mesh);
      // Ajusta la caja de colisión para que llegue hasta el suelo
      const collisionHeight = this.collisionBox.max.y - this.collisionBox.min.y; // Altura del jugador
      this.collisionBox.expandByVector(new THREE.Vector3(0, -collisionHeight , 0));

      this.animations = gltf.animations;

      if (this.animations && this.animations.length) {
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.animations.forEach((clip) => {
          this.mixer.clipAction(clip).play();
        });
      }
    });
  }

  move(x, y, z) {
    if (this.mesh) {
      this.previousPosition = this.mesh.position.clone();
      this.mesh.position.x += x * this.speedMultiplier;
      this.mesh.position.y += y * this.speedMultiplier;
      this.mesh.position.z += z * this.speedMultiplier;

      const direction = new THREE.Vector3(x, 0, z);
      if (direction.length() > 0) {
        direction.normalize();
        const angle = Math.atan2(direction.x, direction.z);
        this.mesh.rotation.y = angle;
      }

      this.collisionBox.setFromObject(this.mesh);
    }
  }

  pickUpObject(object) {
    if (!this.actionInProgress && !this.heldObject && object.isNear(this.collisionBox)) {
      this.actionInProgress = true; // Bloquea nuevas acciones
      this.heldObject = object;

      setTimeout(() => {
        this.actionInProgress = false; // Desbloquea acciones después de un tiempo
      }, 200); // 200 ms de retraso para evitar conflictos
    }
  }
  
  dropObject() {
    if (!this.actionInProgress && this.heldObject) {
      this.actionInProgress = true; // Bloquea nuevas acciones

      this.heldObject.mesh.position.copy(this.mesh.position); // Coloca el objeto en la posición del jugador
      this.heldObject.mesh.position.y = 2.5;
      this.heldObject.updateCollisionBox();
      this.heldObject = null;

      setTimeout(() => {
        this.actionInProgress = false; // Desbloquea acciones después de un tiempo
      }, 200); // 200 ms de retraso para evitar conflictos
    }
  }


  // Método para actualizar la posición del objeto sostenido
  holdObjectInFront() {
    if (this.heldObject && this.heldObject.mesh) {
      const holdPosition = new THREE.Vector3(0, 0.5, 0.7);
      holdPosition.applyQuaternion(this.mesh.quaternion).add(this.mesh.position);
	  this.heldObject.updatePosition(holdPosition);
    }
  }

  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }

    if (this.heldObject) {
      this.holdObjectInFront();
    }
  }

  revertPosition() {
    if (this.mesh && this.previousPosition) {
      this.mesh.position.copy(this.previousPosition);
      this.collisionBox.setFromObject(this.mesh);
    }
  }

  // Aturdir al jugador cuando colisiona con una rata
  stun(stunDuration) {
	if(this.isStunned) return;

	this.isStunned = true;
	this.speedMultiplier = 0;

	setTimeout(() => {
		this.speedMultiplier = 1;
		this.isStunned = false;
	}, stunDuration * 1000); // Aturdir por 1 segundo
  }
}