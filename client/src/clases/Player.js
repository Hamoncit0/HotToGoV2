import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Player {
  constructor(scene, camera, modelPath, initialPosition = { x: 0, y: 2, z: 0 }, name="player1") {
    this.scene = scene;
    this.camera = camera;
    this.name = name;
    this.holdingObject = null;
    
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      this.mesh = gltf.scene; // Obtiene el objeto de la escena
      this.scene.add(this.mesh);

      // Posiciona el jugador
      this.mesh.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
      this.mesh.scale.set(0.5, 0.5, 0.5); // Escala si es necesario

      // Inicializa el box de colisión
      this.collisionBox = new THREE.Box3().setFromObject(this.mesh);
      
      this.animations = gltf.animations; // Obtiene las animaciones

      if (this.animations && this.animations.length) {
        this.mixer = new THREE.AnimationMixer(this.mesh); // Crea un AnimationMixer
        this.animations.forEach((clip) => {
          this.mixer.clipAction(clip).play(); // Reproduce cada animación
        });
      }
    });
  }

  move(x, y, z) {
    if (this.mesh) {
        //guardar la posicion anterior
        this.previousPosition = this.mesh.position.clone();
        // Actualiza la posición
        this.mesh.position.x += x;
        this.mesh.position.y += y;
        this.mesh.position.z += z;

        // Calcula la dirección del movimiento
        const direction = new THREE.Vector3(x, 0, z);
        if (direction.length() > 0) {
            // Normaliza la dirección y calcula el ángulo
            direction.normalize();
            const angle = Math.atan2(direction.x, direction.z); // Calcula el ángulo de rotación
            this.mesh.rotation.y = angle; // Aplica la rotación
        }
          // Actualiza la caja de colisión
          this.collisionBox.setFromObject(this.mesh);
    }
}
update(deltaTime) {
  if (this.mixer) {
    this.mixer.update(deltaTime); // Actualiza el mixer
  }
}
revertPosition() {
  // Revertir la posición del jugador a la anterior
  if (this.mesh && this.previousPosition) {
      this.mesh.position.copy(this.previousPosition);
      this.collisionBox.setFromObject(this.mesh);
  }
}


}