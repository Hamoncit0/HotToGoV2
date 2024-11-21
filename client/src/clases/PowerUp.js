import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export default class PowerUp {
  constructor(scene, modelPath, position, effect, duration = 5, name = "powerup") {
    this.scene = scene;
    this.name = name;
    this.effect = effect; // Tipo de efecto: "time", "speed", "points"
    this.duration = duration; // Duración del efecto en segundos (si aplica)
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    const mtlPath = modelPath + '.mtl';
    

    mtlLoader.load(mtlPath, (materials) => {
      materials.preload();
      objLoader.setMaterials(materials);

      objLoader.load(modelPath + '.obj', (obj) => {
        this.mesh = obj;
        this.scene.add(this.mesh);
        this.mesh.scale.copy(new THREE.Vector3(0.5, 0.5, 0.5));
        this.mesh.position.set(position.x, position.y, position.z);

        // Crear la caja de colisión
        this.collisionBox = new THREE.Box3().setFromObject(this.mesh);
      });
    });
  }

  applyEffect(player, gameController) {
    if (this.effect === "time") {
      gameController.timeRemaining += 5; // Añade tiempo al juego
    } else if (this.effect === "speed") {
      player.speedMultiplier = 2; // Doble velocidad
      gameController.removeAllRats();
      setTimeout(() => {
        player.speedMultiplier = 1; // Restaura la velocidad original
      }, this.duration * 1000);
    } else if (this.effect === "points") {
      gameController.points += 10; // Añade puntos
      gameController.updateScoreDisplay();
    }
    this.destroy();
  }

  isNear(collisionBox) {
    if (!this.collisionBox) {
      return false;
    }
    return this.collisionBox.intersectsBox(collisionBox);
  }

  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
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
      this.mesh = null;
      this.collisionBox = null;
    }
  }
}
