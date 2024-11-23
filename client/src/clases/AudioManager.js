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
        
        // Inicializar el estado de silenciado
        this.isMuted = false; // Por defecto, la música no está silenciada
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
            this.backgroundMusic.setVolume(this.isMuted ? 0 : volume); // Verifica si está silenciado
            if (!this.isMuted) {
                this.backgroundMusic.play(); // Solo reproduce si no está silenciado
            }
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

    // Ajustar el volumen de la música de fondo
    setBackgroundMusicVolume(volume) {
        if (this.backgroundMusic) {
            this.backgroundMusic.setVolume(volume);
        }
    }

    // Ajustar el volumen de un efecto de sonido
    setSoundVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound) {
            sound.setVolume(volume);
        } else {
            console.warn(`Sonido ${name} no encontrado`);
        }
    }

    // Alternar entre silenciar y activar la música
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.backgroundMusic) {
            this.backgroundMusic.setVolume(this.isMuted ? 0 : 0.3); // Establece el volumen según el estado
            if (this.isMuted) {
                this.backgroundMusic.pause(); // Si está silenciado, detén la música
            } else {
                this.backgroundMusic.play(); // Si no está silenciado, reanuda la música
            }
        }
    }
}

export default AudioManager;