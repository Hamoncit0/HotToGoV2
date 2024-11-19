import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import PowerUp from './PowerUp.js';
export default class GameController {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.orders = []; // Array para guardar órdenes
        this.points = 0; // Puntuación inicial
        this.timeRemaining = 300; // Tiempo en segundos
        this.deliveryZones = []; // Zonas de entrega


        //Variables que controlan la dificultad
        this.orderFrequency = 10000;
        this.orderMaxTime = 30;
        this.maxOrderCapacity = 4;

        this.clock = new THREE.Clock();
        this.isPlaying = false;

        // Referencias a elementos de la interfaz
        this.ordersContainer = document.querySelector('.ordenes');
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');

        this.powerUps = [];
        
        const powerUp1 = new PowerUp(scene, './src/models/power-ups/monster', { x: -2, y: 2, z: -2 }, "speed");
        const powerUp2 = new PowerUp(scene, './src/models/power-ups/timer', { x: 0, y: 2, z: -2 }, "time");
        const powerUp3 = new PowerUp(scene, './src/models/power-ups/coin', { x: 2, y: 2, z: -2 }, "points");

        this.powerUps.push(powerUp1, powerUp2, powerUp3); 
        // Intervalo para decrementar el tiempo
        setInterval(() => {
            if (this.isPlaying && this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateTimeDisplay();
            }
        }, 1000);
    } 
    
    updateTimeDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timeElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateScoreDisplay() {
        this.scoreElement.textContent = `Score: ${this.points.toString().padStart(4, '0')}`;
    }

    updateOrdersDisplay() {
        this.ordersContainer.innerHTML = ''; // Limpia las órdenes actuales
        this.orders.forEach((order) => {
            // Crea un nuevo elemento para cada orden
            const orderElement = document.createElement('div');
            orderElement.classList.add('orden');
            let color ='#00FF00';
            if(order.timeRemaining>= (this.orderMaxTime * .7)){
                color ='#00FF00';

            }
            else if(order.timeRemaining >= (this.orderMaxTime * .5)){
                color ='#FFFF00';
            }
            else if(order.timeRemaining >= (this.orderMaxTime * .3)){
                color = '#FF7700';
            }
            else{
                
                color = '#FF0000'
            }
            orderElement.innerHTML = `
                <div class="orden-content">
                    <img src="./imagenes/${order.item.toLowerCase()}.png" alt="${order.item}">
                    <h3>${order.item}</h3>
                </div>
                <div class="orden-timeleft" style="width: ${(order.timeRemaining * 100) / (this.orderMaxTime)}%; background-color: ${color}; "></div>
            `;

            this.ordersContainer.appendChild(orderElement);
        });
    }

    // Carga de la zona de entrega
    loadDeliveryZone(modelPath, materialPath, position) {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();

        mtlLoader.load(materialPath, (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load(modelPath, (object) => {
                object.position.set(position.x, position.y, position.z);
                object.scale.set(0.5, 0.5, 0.5); // Ajusta el tamaño según sea necesario
                this.scene.add(object);

                // Añadir una caja de colisión para verificar entregas
                const collisionBox = new THREE.Box3().setFromObject(object);
                this.deliveryZones.push({ object, collisionBox });
            });
        });
    }

    // Generar una nueva orden
    generateOrder() {
        if (this.orders.length >= 4) {
            // Si ya hay 4 órdenes, no genera una nueva
            console.warn("No se pueden generar más de 4 órdenes activas.");
            return;
        }
        
        const items = ['Pizza', 'Agua', 'Risoto', 'Lasagna'];
        const randomItem = items[Math.floor(Math.random() * items.length)];

        const newOrder = {
            item: randomItem,
            timeRemaining: this.orderMaxTime, // Tiempo para entregar la orden en segundos
        };

        this.orders.push(newOrder);
        this.updateOrdersDisplay();

        // Intervalo para actualizar el tiempo restante de la orden
        const orderIndex = this.orders.length - 1;
        const interval = setInterval(() => {
            if (!this.isPlaying || this.orders[orderIndex] === undefined) {
                clearInterval(interval);
                return;
            }

            this.orders[orderIndex].timeRemaining--;

            if (this.orders[orderIndex].timeRemaining <= 0) {
                clearInterval(interval);
                this.orders.splice(orderIndex, 1); // Eliminar orden
                this.points -= 10; // Penalización por no entregar
                this.updateScoreDisplay();
                this.updateOrdersDisplay();
            } else {
                this.updateOrdersDisplay();
            }
        }, 1000);
    }

    // Verificar entrega
    checkDelivery() {
        if (this.player.heldObject) {
            const deliveredItem = this.player.heldObject.name;
            const orderIndex = this.orders.findIndex(order => order.item === deliveredItem);

            if (orderIndex !== -1) {
                this.orders.splice(orderIndex, 1);
                this.points += 10;
                this.updateScoreDisplay();
                this.updateOrdersDisplay();
            } else {
                this.points -= 5;
                this.updateScoreDisplay();
            }
            this.player.heldObject.destroy();
            this.player.heldObject = null;
        }
    }
    // Actualizar lógica del juego
    update() {
        const delta = this.clock.getDelta();
        //console.log(this.player.heldObject);

        // Verificar colisiones con zonas de entrega
        this.deliveryZones.forEach((zone) => {
            if (zone.collisionBox.intersectsBox(this.player.collisionBox)) {
                this.checkDelivery();
                this.player.revertPosition();
            }
        });

        // Fin del juego
        if (this.timeRemaining <= 0) {
            this.isPlaying = false;
            console.log(`Juego terminado. Puntuación final: ${this.points}`);
        }
        // Verificar colisiones con PowerUps
        this.powerUps.forEach((powerUp, index) => {
            if (powerUp.isNear(this.player.collisionBox)) {
            powerUp.applyEffect(this.player, this);
            powerUps.splice(index, 1); // Eliminar el power-up del array
            }
        });
    }
}
