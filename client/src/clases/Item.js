import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal){
    console.log('Started loading file:' + url + '\nLoaded' + itemsLoaded + ' of ' + itemsTotal + 'files.')
}
manager.onLoad = function (){
    console.log('Loading complete!')
}
manager.onProgress = function (url, itemsLoaded, itemsTotal){
    console.log('Loading file:' + url + '\nLoaded' + itemsLoaded + ' of ' + itemsTotal + 'files.')
}
manager.onError = function (url){
    console.log('There was an error loading ' + url)
}

export default class Item {
  constructor(scene, modelPath, position, name = "object") {
    this.scene = scene;
    this.name = name;
    const mtlLoader = new MTLLoader(manager);
    const objLoader = new OBJLoader(manager);

    // Cambia la extensión del modelPath a .mtl
    const mtlPath = modelPath + '.mtl';

    // Carga el archivo .mtl
    mtlLoader.load(mtlPath, (materials) => {
      materials.preload(); // Precarga el material

      // Asigna el material al OBJLoader
      objLoader.setMaterials(materials);

      // Carga el modelo .obj con el material aplicado
      objLoader.load(modelPath + '.obj', (obj) => {
        this.mesh = obj;
        this.scene.add(this.mesh);
        this.mesh.position.set(position.x, position.y, position.z);
        
        // Crear la caja de colisión
        this.collisionBox = new THREE.Box3().setFromObject(this.mesh);
      });
    });
  }
  
  updatePosition(newPosition) {
    this.mesh.position.copy(newPosition);
  }

  // Método para detectar si el jugador está cerca
  isNear(collisionBox) {
    return this.collisionBox.intersectsBox(collisionBox);
  }

  // Método para esconder el objeto (por ejemplo, cuando es recogido)
  hide() {
    if (this.mesh) {
      this.mesh.visible = false;
    }
  }
  
  updateCollisionBox() {
    if (this.mesh) {
      this.collisionBox.setFromObject(this.mesh);
    }
  }
}