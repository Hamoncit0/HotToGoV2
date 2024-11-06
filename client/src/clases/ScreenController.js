//funciones
import { city, beach, minecraft } from "../scene/backgroundModels.js";
import { setupLighting, setUpLightingBeach, setUpLightingMinecraft } from '../scene/lighting.js';
import AudioManager from './AudioManager.js';


import * as THREE from 'three';
export class ScreenController {
    constructor(container, renderer, clock, animate, scene, camera) {
        this.container = container;
        this.renderer = renderer;
        this.clock = clock;
        this.animate = animate;
        this.scene = scene;
        this.camera = camera;
        this.audioManager = new AudioManager(camera);
        this.isGameRunning = false;
        this.isGamePaused = false;
        this.actualScreen = null;
        this.playerModeSelected = 0; // 0: single player, 1: multiplayer
        this.mapSelected = 0; // 0: city, 1: beach
        this.difficulty = 0; // 0: normal, 1: hard

        // PANTALLAS
        this.Screens = {
            MAIN: document.getElementById('game-ui'),
            PAUSE: document.getElementById('pause-menu'),
            PLAYER: document.getElementById('player-mode'),
            DIFFICULTY: document.getElementById('difficulty-mode'),
            MAP: document.getElementById('map-selector'),
            USERNAME: document.getElementById('username-input'),
            GAMEOVER: document.getElementById('game-over'),
            GAME: container,
            SETTINGS: document.getElementById('config-screen')
        };

        // BOTONES
        this.Buttons = {
            play: document.getElementById('play-btn'),
            singlePlayer: document.getElementById('singleplayer-btn'),
            multiPlayer: document.getElementById('multiplayer-btn'),
            normal: document.getElementById('normal-btn'),
            hard: document.getElementById('hard-btn'),
            city: document.getElementById('select-city'),
            beach: document.getElementById('select-beach'),
            minecraft: document.getElementById('select-minecraft'),
            join: document.getElementById('join-btn'),
            end: document.getElementById('end-btn'),
            goBackPlayer: document.getElementById('go-back-player'),
            goBackMap: document.getElementById('go-back-map'),
            goBackUser: document.getElementById('go-back-username'),
            continue: document.getElementById('resume-btn'),
            settings: document.getElementById('settings'),
            highscore: document.getElementById('highscore-btn'),
        };
        this.audioManager.loadBackgroundMusic('./src/sounds/Spagonia (Day) - Sonic Unleashed [OST].mp3');

        // Cargar efecto de sonido para clics
        this.audioManager.loadSound('click', './src/sounds/ButtonPlate Click (Minecraft Sound) - Sound Effect for editing.mp3');

        this.init();
    }

    // Inicializa los listeners de los botones y eventos
    init() {
        this.actualScreen = this.Screens.MAIN;

        // Agregar sonido a todos los botones en this.Buttons
        Object.keys(this.Buttons).forEach((buttonKey) => {
            const button = this.Buttons[buttonKey];
            button.addEventListener('click', () => {
                this.audioManager.playSound('click');
            });
        });

        this.Buttons.play.addEventListener('click', () => {this.goToScreen(this.Screens.PLAYER); });
        this.Buttons.singlePlayer.addEventListener('click', () => this.selectPlayerMode(0));
        this.Buttons.multiPlayer.addEventListener('click', () => this.selectPlayerMode(1));
        this.Buttons.normal.addEventListener('click', () => this.selectDifficulty(0));
        this.Buttons.hard.addEventListener('click', () => this.selectDifficulty(1));
        this.Buttons.city.addEventListener('click', () => this.selectMap(0));
        this.Buttons.beach.addEventListener('click', () => this.selectMap(1));
        this.Buttons.minecraft.addEventListener('click', () => this.selectMap(2));
        this.Buttons.join.addEventListener('click', () => this.startGame());
        this.Buttons.continue.addEventListener('click', () => this.resumeGame());
        this.Buttons.end.addEventListener('click', () => this.goToScreen(this.Screens.MAIN));
        this.Buttons.goBackPlayer.addEventListener('click', () => this.goToScreen(this.Screens.MAIN));
        this.Buttons.goBackMap.addEventListener('click', () => this.goToScreen(this.Screens.PLAYER));
        this.Buttons.goBackUser.addEventListener('click', () => this.goToScreen(this.Screens.MAP));
        this.Buttons.settings.addEventListener('click', () => this.goToScreen(this.Screens.SETTINGS));

        window.addEventListener('keydown', (event) => this.handleKeydown(event));
    }

    handleKeydown(event) {
        if (event.key === 'Escape' && this.isGameRunning) {
            if (this.isGamePaused) this.resumeGame();
            else this.pauseGame();
        }
    }

    goToScreen(screen) {
        if (this.actualScreen) this.actualScreen.style.display = 'none';
        this.actualScreen = screen;
        this.actualScreen.style.display = 'block';
    }

    selectPlayerMode(mode) {
        this.playerModeSelected = mode;
        this.goToScreen(this.Screens.DIFFICULTY);
    }
    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.goToScreen(this.Screens.MAP);

    }

    selectMap(map) {
        this.mapSelected = map;

        this.camera.updateProjectionMatrix(); 

        if (this.playerModeSelected === 0) this.startGame();
        else this.goToScreen(this.Screens.USERNAME);
    }

    startGame() {
        this.isGameRunning = true;
        this.goToScreen(this.Screens.GAME);
        this.renderer.setSize(this.Screens.GAME.clientWidth, this.Screens.GAME.clientHeight);

        if (this.mapSelected === 0){ 
            city(this.scene);
            this.audioManager.loadBackgroundMusic('./src/sounds/pizza.mp3');
            this.camera.position.set(0, 6, -1);
            this.camera.lookAt(new THREE.Vector3(0, 2, -5));
            
            setupLighting(this.scene);
        }
        else if(this.mapSelected === 1){ 
            beach(this.scene);
            this.audioManager.loadBackgroundMusic('./src/sounds/Sweet Sweet Canyon - Mario Kart 8 Deluxe OST.mp3');
            this.camera.position.set(0, 6, 0);
            this.camera.lookAt(new THREE.Vector3(0, 2.5, -5));
            setUpLightingBeach(this.scene);
        }
        else{ 
            minecraft(this.scene);
            this.audioManager.loadBackgroundMusic('./src/sounds/room.mp3');
            this.camera.position.set(0, 6, 0);
            this.camera.lookAt(new THREE.Vector3(0, 2.5, -5));
            setUpLightingMinecraft(this.scene);
        }


        this.clock.start();
        this.animate(this.isGameRunning, this.isGamePaused);
    }

    pauseGame() {
        this.isGamePaused = true;
        this.clock.stop();
        this.goToScreen(this.Screens.PAUSE);
    }

    resumeGame() {
        this.isGamePaused = false;
        this.goToScreen(this.Screens.GAME);
        this.renderer.setSize(this.Screens.GAME.clientWidth, this.Screens.GAME.clientHeight);
        this.clock.start();
        this.animate();
    }

    endGame() {
        this.isGameRunning = false;
        this.isGamePaused = false;
        this.clock.stop();
        this.Screens.PAUSE.setAttribute('hidden', true);
        this.Screens.GAMEOVER.style.display = 'block';
        this.Screens.GAME.setAttribute('hidden', true);
    }
}
