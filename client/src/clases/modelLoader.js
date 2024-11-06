// src/classes/ModelLoader.js
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

export function loadModel(path, name, scene, rotation = { x: 0, y: 0, z: 0 }, position = {x: 0, y: 0, z: 0}, colision = false) {
  const loaderModel = new OBJLoader(manager);
  const mtlModel = new MTLLoader(manager);

  mtlModel.load(path + '.mtl', (materials) => {
    materials.preload();
    loaderModel.setMaterials(materials);
    loaderModel.load(path + '.obj', (object) => {
      object.name = name;
      object.scale.copy(new THREE.Vector3(0.5, 0.5, 0.5));
      object.rotation.x = rotation.x;
      object.rotation.y = rotation.y;
      object.rotation.z = rotation.z;
      object.position.set = new THREE.Vector3(position.x, position.y, position.z);
      scene.add(object);
      // Crea y asigna una caja de colisión al modelo
      if(colision)
      object.collisionBox = new THREE.Box3().setFromObject(object);
    });
  });
}