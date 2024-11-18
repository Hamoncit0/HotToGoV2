import * as THREE from 'three';
import Item from './Item.js';

export default class Dispenser {
    constructor(scene, position, camera, name) {
      this.scene = scene;
      this.position = new THREE.Vector3(position.x, position.y, position.z);
      this.items = []; // Array para almacenar las items generadas
      this.canDispense = true;
      this.camera = camera; // Cámara para orientar el billboard
      this.name = name;

      const cubeTexture = new THREE.TextureLoader().load('./imagenes/crate.jpg');
      // Crear el modelo de la estufa (dispenser)
      this.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ map: cubeTexture })
      );
      this.mesh.position.copy(position);
      this.scene.add(this.mesh);
  
      // Caja de colisión para el dispenser
      this.collisionBox = new THREE.Box3().setFromObject(this.mesh);

       // Crear el billboard con la imagen
       this.billboard = this.createImageBillboard( `./imagenes/${name}.png`);
       this.billboard.position.set(position.x, position.y + 1, position.z);
       this.scene.add(this.billboard);
    }
     createImageBillboard(imagePath) {
        // Crear textura a partir de la imagen
        const texture = new THREE.TextureLoader().load(imagePath);

        // Crear material del Sprite
        const material = new THREE.SpriteMaterial({ map: texture });

        // Crear el Sprite
        const sprite = new THREE.Sprite(material);

        // Escalar el billboard (ajusta los valores según el tamaño deseado)
        sprite.scale.set(1, 0.5, 1); // Ancho, alto, profundidad
        return sprite;
    }
  
    // Método para detectar si el jugador está cerca
    isNear(player) {
      this.collisionBox.setFromObject(this.mesh); // Asegura que esté actualizada
      return this.collisionBox.intersectsBox(player.collisionBox);
    }
    // Método para generar una pizza
    dispenseItem() {

      if (this.canDispense) {
        const itemPosition = this.position.clone();
        itemPosition.y += 1; // Colocar la pizza sobre el dispenser
        const item = new Item(this.scene, `./src/models/comida/${this.name}`, itemPosition, this.name);
        this.items.push(item);
        
        // Bloquea el dispensador para evitar crear más items en este ciclo
        this.canDispense = false;
        
        // Establece un tiempo de espera de 1 segundo antes de poder dispensar otra pizza
        setTimeout(() => {
          this.canDispense = true; // Vuelve a permitir dispensar una pizza
        }, 1000); // 1000 ms = 1 segundo
      }
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
    
    update(){
      this.items = this.items.filter(item => item.collisionBox !== null);
      // Asegurar que el billboard siempre mire hacia la cámara
      if (this.billboard && this.camera) {
        this.billboard.lookAt(this.camera.position);
    }

    }

  }