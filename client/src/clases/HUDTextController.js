import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export class HUDTextController {
    constructor(container) {
        // Crear el CSS2DRenderer para renderizar texto
        this.labelRenderer = new CSS2DRenderer();
        
        // Ajustamos el tamaño al contenedor específico
        this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0';
        this.labelRenderer.domElement.style.left = '0';
        this.labelRenderer.domElement.style.width = '100%';
        this.labelRenderer.domElement.style.height = '100%';
        this.labelRenderer.domElement.style.pointerEvents = 'none'; // Evitar interferencias con clicks

        container.appendChild(this.labelRenderer.domElement); // Agregar al contenedor
    }

    addText(message, position) {
        const div = document.createElement('div');
        div.className = 'hud-label';
        div.textContent = message;
        div.style.position = 'relative';
        div.style.color = 'white';
        div.style.fontFamily = 'Gill Sans Nova Cond Ultra Bold, sans-serif';
        div.style.fontSize = '30px';
        div.style.textShadow = '1px 1px 2px black'; // Efecto de sombra

        const textObject = new CSS2DObject(div);
        textObject.position.set(position.x, position.y, position.z); // Posición en el espacio 3D
        return textObject;
    }

    render(scene, camera) {
        this.labelRenderer.render(scene, camera);
    }

    updateSize(container) {
        this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
    }
}
