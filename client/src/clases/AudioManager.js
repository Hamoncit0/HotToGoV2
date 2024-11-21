// AudioManager.js
import * as THREE from 'three';

class AudioManager {
    constructor(camera) {
        // Crear el contexto de audio y agregarlo a la cámara
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        
        // Inicializar el cargador de audio
        this.audioLoader = new THREE.AudioLoader();
        
        // Almacenar música de fondo y efectos
        this.backgroundMusic = null;
        this.sounds = {};
    }

    // Cargar y reproducir música de fondo
    loadBackgroundMusic(path, volume = 0.3, loop = true) {
        if (this.backgroundMusic != null && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();  // Detiene la música de fondo actual si está sonando
        }
        this.backgroundMusic = new THREE.Audio(this.listener);
        this.audioLoader.load(path, (buffer) => {
            this.backgroundMusic.setBuffer(buffer);
            this.backgroundMusic.setLoop(loop);
            this.backgroundMusic.setVolume(volume);
            this.backgroundMusic.play();
        });
    }

    // Cargar un efecto de sonido
    loadSound(name, path, volume = 0.5) {
        const sound = new THREE.Audio(this.listener);
        this.audioLoader.load(path, (buffer) => {
            sound.setBuffer(buffer);
            sound.setVolume(volume);
            this.sounds[name] = sound;
        });
    }

    // Reproducir un efecto de sonido
    playSound(name) {
        const sound = this.sounds[name];
        if (sound && !sound.isPlaying) {
            sound.play();
        } else if (sound && sound.isPlaying) {
            sound.stop(); // Asegura que no se solape
            sound.play();
        } else {
            console.warn(`Sonido ${name} no encontrado`);
        }
    }
    // Detener un efecto de sonido
    stopSound(name) {
        const sound = this.sounds[name];
        if (sound && sound.isPlaying) {
            sound.stop();
        }
    }


    // Pausar la música de fondo
    pauseBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
        }
    }

    // Reanudar la música de fondo
    resumeBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play();
        }
    }
}

export default AudioManager;
