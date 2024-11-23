import * as THREE from 'three';

export function setupLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight( 0x0080d4, 4, 100 );
  pointLight.position.set( 0, 4, -8.5 );
  scene.add( pointLight );

}

export function setUpLightingBeach(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight( 0xff2d00, 8, 100 );
  pointLight.position.set( 1, 4, -8.7 );
  scene.add( pointLight );

  //const sphereSize = 1;
  //const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  //scene.add( pointLightHelper );

}
export function setUpLightingMinecraft(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight( 0xffffff, 6, 100 );
  pointLight.position.set( 0, 10, -8 );
  scene.add( pointLight );

}