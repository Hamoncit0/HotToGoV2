import * as THREE from 'three';

export function createFireSystem(particleCount, size, nameparticles) {
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(nameparticles); // Cargar la textura de la partícula

    const particlesGeometry = new THREE.BufferGeometry();

    const particlesMaterial = new THREE.PointsMaterial({
        size,
        map: particleTexture,  // Usar la textura cargada
        transparent: true,
        alphaTest: 0.5,
        depthWrite: false,
        blending: THREE.NormalBlending,
        vertexColors: true,  // Usar colores personalizados en las partículas
    });

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);   // Colores RGB de las partículas
    const lifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        positions[index] = (Math.random() - 0.5) * 2;  // X
        positions[index + 1] = Math.random() * 2;      // Y
        positions[index + 2] = (Math.random() - 0.5) * 2; // Z

        lifetimes[i] = Math.random();

        // Inicializar las partículas con colores blancos (esto se actualizará más tarde)
        colors[index] = 1;    // R
        colors[index + 1] = 1;  // G
        colors[index + 2] = 1;  // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));  // Asignar los colores
    particlesGeometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);

    return { particleSystem, particlesGeometry, particlesMaterial };
}

export function updateFire(particlesGeometry, deltaTime) {
    const positions = particlesGeometry.attributes.position.array;
    const lifetimes = particlesGeometry.attributes.lifetime.array;
    const colors = particlesGeometry.attributes.color.array;  // Obtener los colores actuales de las partículas

    const maxHeight = 2;  // La altura máxima donde las partículas deben volverse blancas

    for (let i = 0; i < lifetimes.length; i++) {
        lifetimes[i] -= deltaTime * 0.5;

        if (lifetimes[i] <= 0) {
            // Reiniciar la partícula
            lifetimes[i] = 1;
            positions[i * 3] = (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] = 0;  // Y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        } else {
            // Movimiento ascendente y dispersión
            positions[i * 3 + 1] += deltaTime * 2;  // Subir
            positions[i * 3] += (Math.random() - 0.5) * deltaTime;  // Dispersión X
            positions[i * 3 + 2] += (Math.random() - 0.5) * deltaTime;  // Dispersión Z
        }

        // Cambio de color de las partículas basadas en la altura
        const height = positions[i * 3 + 1];  // Y (altura de la partícula)

        if (height >= maxHeight) {
            // Cambiar a color blanco (simulando con valores RGB al máximo)
            colors[i * 3] = 1;    // R
            colors[i * 3 + 1] = 1;  // G
            colors[i * 3 + 2] = 1;  // B
        } else {
            // Hacer que el color sea más cercano a blanco a medida que sube
            const factor = height / maxHeight;
            colors[i * 3] = factor;  // R
            colors[i * 3 + 1] = factor;  // G
            colors[i * 3 + 2] = factor;  // B
        }
    }

    // Marcar atributos como actualizables
    particlesGeometry.attributes.position.needsUpdate = true;
    particlesGeometry.attributes.color.needsUpdate = true;  // Necesitamos actualizar los colores
}
