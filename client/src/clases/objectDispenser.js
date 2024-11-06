import * as THREE from 'three';

export default class ObjectDispenser {
  constructor(scene, modelPath, position) {
    this.scene = scene;

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      this.mesh = gltf.scene;
      this.scene.add(this.mesh);
      this.mesh.position.set(position.x, position.y, position.z);
      this.collisionBox = new THREE.Box3().setFromObject(this.mesh); // Caja de colisión
    });
  }

  // Método para detectar si el jugador está cerca
  isNear(player) {
    return this.collisionBox.intersectsBox(player.collisionBox);
  }

  // Método para esconder el objeto (por ejemplo, cuando es recogido)
  hide() {
    if (this.mesh) {
      this.mesh.visible = false;
    }
  }
}
