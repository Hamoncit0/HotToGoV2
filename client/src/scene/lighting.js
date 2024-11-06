import * as THREE from 'three';

export function setupLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 4);
  scene.add(ambientLight);

}

export function setUpLightingBeach(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 6);
  scene.add(ambientLight);

}
export function setUpLightingMinecraft(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLight);

}