import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Rat { 
    constructor(scene, initialPosition = { x: 0, y: 2, z: 0 }) {
        this.scene = scene;

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

    update(deltaTime) {
        if (this.mixer) {
          this.mixer.update(deltaTime);
        }
    }
}