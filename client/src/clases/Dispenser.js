import * as THREE from 'three';
import Item from './Item.js';

export default class Dispenser {
    constructor(scene, position) {
      this.scene = scene;
      this.position = new THREE.Vector3(position.x, position.y, position.z);
      this.items = []; // Array para almacenar las items generadas
      this.canDispense = true;
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

      if (this.canDispense) {
        const itemPosition = this.position.clone();
        itemPosition.y += 1; // Colocar la pizza sobre el dispenser
        const pizza = new Item(this.scene, './src/models/comida/Pizza', itemPosition, 'pizza');
        this.items.push(pizza);
        
        // Bloquea el dispensador para evitar crear más items en este ciclo
        this.canDispense = false;
        
        // Establece un tiempo de espera de 1 segundo antes de poder dispensar otra pizza
        setTimeout(() => {
          this.canDispense = true; // Vuelve a permitir dispensar una pizza
        }, 1000); // 1000 ms = 1 segundo
      }
    }
    // Método para generar una pizza
     
    dispenseLasagna() {

      if (this.canDispense) {
        const itemPosition = this.position.clone();
        itemPosition.y += 1; // Colocar la pizza sobre el dispenser
        const pizza = new Item(this.scene, './src/models/comida/Lasana', itemPosition, 'lasagna');
        this.items.push(pizza);
        
        // Bloquea el dispensador para evitar crear más items en este ciclo
        this.canDispense = false;
        
        // Establece un tiempo de espera de 1 segundo antes de poder dispensar otra pizza
        setTimeout(() => {
          this.canDispense = true; // Vuelve a permitir dispensar una pizza
        }, 1000); // 1000 ms = 1 segundo
      }
    }
    // Método para generar una pizza
    dispenseRisotto() {

      if (this.canDispense) {
        const itemPosition = this.position.clone();
        itemPosition.y += 1; // Colocar la pizza sobre el dispenser
        const pizza = new Item(this.scene, './src/models/comida/Risoto', itemPosition, 'risoto');
        this.items.push(pizza);
        
        // Bloquea el dispensador para evitar crear más items en este ciclo
        this.canDispense = false;
        
        // Establece un tiempo de espera de 1 segundo antes de poder dispensar otra pizza
        setTimeout(() => {
          this.canDispense = true; // Vuelve a permitir dispensar una pizza
        }, 1000); // 1000 ms = 1 segundo
      }
    }

    dispenseAgua() {

      if (this.canDispense) {
        const itemPosition = this.position.clone();
        itemPosition.y += 1; // Colocar la pizza sobre el dispenser
        const pizza = new Item(this.scene, './src/models/comida/Vaso', itemPosition, 'agua');
        this.items.push(pizza);
        
        // Bloquea el dispensador para evitar crear más items en este ciclo
        this.canDispense = false;
        
        // Establece un tiempo de espera de 1 segundo antes de poder dispensar otra pizza
        setTimeout(() => {
          this.canDispense = true; // Vuelve a permitir dispensar una pizza
        }, 1000); // 1000 ms = 1 segundo
      }
    }

    update(){
      this.items = this.items.filter(item => item.collisionBox !== null);

    }

  }