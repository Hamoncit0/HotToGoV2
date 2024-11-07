import * as THREE from 'three';
import Item from './Item';

export default class Dispenser {
    constructor(scene, position) {
      this.scene = scene;
      this.position = position;
      this.items = []; // Array para almacenar las pizzas generadas
  
      // Crear el modelo de la estufa (dispenser)
      this.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x808080 })
      );
      this.mesh.position.copy(position);
      this.scene.add(this.mesh);
  
      // Caja de colisión para el dispenser
      this.collisionBox = new THREE.Box3().setFromObject(this.mesh);
    }
  
    // Método para detectar si el jugador está cerca
    isNear(player) {
      this.collisionBox.setFromObject(this.mesh); // Asegura que esté actualizada
      return this.collisionBox.intersectsBox(player.collisionBox);
    }
  
    // Método para generar una pizza
    dispensePizza() {
      const pizzaPosition = this.position.clone();
      pizzaPosition.y += 1; // Colocar la pizza sobre el dispenser
      const pizza = new Item(this.scene, './src/models/comida/Pizza' ,pizzaPosition);
      this.pizzas.push(pizza);
    }
  }