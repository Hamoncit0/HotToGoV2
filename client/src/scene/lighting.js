import * as THREE from 'three';

export function setupLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 3.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight( 0x0080d4, 15, 100 );
  pointLight.position.set( 0, 3.5, -8.5 );
  scene.add( pointLight );

}

export function setUpLightingBeach(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  // Luz direccional para simular el sol
  const sunLight = new THREE.DirectionalLight(0xfff6e5, 1); // Color cálido para parecerse al sol
  sunLight.position.set(10, 25, -10); // Ajusta la posición para simular la dirección del sol
  sunLight.castShadow = true; // Permitir sombras
  
  // Configuración de las sombras
  sunLight.shadow.mapSize.width = 2048; // Mayor resolución para sombras más detalladas
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;

  // Ajustar el área de sombra proyectada
  sunLight.shadow.camera.left = -15;
  sunLight.shadow.camera.right = 15;
  sunLight.shadow.camera.top = 15;
  sunLight.shadow.camera.bottom = -15;

  scene.add(sunLight);

  //const sphereSize = 1;
  //const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  //scene.add( pointLightHelper );

}
export function setUpLightingMinecraft(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight( 0xffffff, 10, 100 );
  pointLight.position.set( 0, 10, -8 );
  scene.add( pointLight );

}