//funciones
import { city, beach, minecraft } from "../scene/backgroundModels.js";
import { setupLighting, setUpLightingBeach, setUpLightingMinecraft } from '../scene/lighting.js';
import AudioManager from './AudioManager.js';
import GameController from "./GameController.js";
import { getHighscores, saveHighscore } from "../webServices/webService.js";

import { updateFire } from '../clases/particles.js';

import * as THREE from 'three';
export class ScreenController {
    constructor(container, renderer, clock, animate, scene, camera, gameController, socket) {
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
        this.gameMode = 0; // 0: time, 1: lives
        this.mapSelected = 0; // 0: city, 1: beach
        this.difficulty = 0; // 0: normal, 1: hard
        this.gameController = gameController;
        this.gameController.screenController = this;
		this.isMuted = false;
        this.gameController.audioManager = this.audioManager;
        this.socket = socket;
        this.room= '';

        this.particlesToUpdate = [];

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
            SETTINGS: document.getElementById('config-screen'),
            HIGHSCORES: document.getElementById('highscores'),
            ROOM: document.getElementById('room-input'),
            MODE: document.getElementById('game-mode')
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
            goBackDifficulty: document.getElementById('go-back-difficulty'),
            continue: document.getElementById('resume-btn'),
            settings: document.getElementById('settings'),
			settingsCheckbox1: document.getElementById('custom-checbox'),
			settingsCheckbox2: document.getElementById('custom-checbox1'),
			settingsCheckbox3: document.getElementById('custom-checbox2'),
            highscore: document.getElementById('highscore-btn'),
            goBackEnd: document.getElementById('btn-go-back-end'),
            goBackSettings: document.getElementById('btn-go-back-settings'),
            goBackHighscores: document.getElementById('btn-go-back-highscores'),
            joinRoom: document.getElementById('join-room-btn'),
            goBackRoom: document.getElementById('go-back-room'),
            limitedTime: document.getElementById('limitedtime-btn'),
            byLives: document.getElementById('bylives-btn'),
            goBackMode: document.getElementById('go-back-mode')
        };
        this.audioManager.loadBackgroundMusic('./src/sounds/Spagonia (Day) - Sonic Unleashed [OST].mp3');

        // Cargar efecto de sonido para clics
        this.audioManager.loadSound('click', './src/sounds/ButtonPlate Click (Minecraft Sound) - Sound Effect for editing.mp3');
        this.audioManager.loadSound('ratVisible', './src/sounds/concrete.mp3', 1);

        this.init();
    }
    //Actualizar particulas
    updateParticles(deltaTime) {
        if (this.particlesToUpdate.length > 0) {
            this.particlesToUpdate.forEach(particle => {
                updateFire(particle, deltaTime); // Lógica de actualización de partículas
            });
        }
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
        this.Buttons.join.addEventListener('click', () => {
            if(this.playerModeSelected == 1)
            this.goToScreen(this.Screens.ROOM)
            else if(this.playerModeSelected == 0)
            this.startGame();
        }
        );
        this.Buttons.continue.addEventListener('click', () => this.resumeGame());
        this.Buttons.end.addEventListener('click', () => location.reload());
        this.Buttons.goBackPlayer.addEventListener('click', () => this.goToScreen(this.Screens.MAIN));
        this.Buttons.goBackMap.addEventListener('click', () => this.goToScreen(this.Screens.DIFFICULTY));
        this.Buttons.goBackUser.addEventListener('click', () => this.goToScreen(this.Screens.MAP));
        this.Buttons.goBackDifficulty.addEventListener('click', () => this.goToScreen(this.Screens.MODE));
        this.Buttons.goBackEnd.addEventListener('click', () => location.reload());
        this.Buttons.settings.addEventListener('click', () => this.goToScreen(this.Screens.SETTINGS));
		this.Buttons.settingsCheckbox1.addEventListener('click', () => this.resizeWindow(1));  // Full 
		this.Buttons.settingsCheckbox2.addEventListener('click', () => this.resizeWindow(0.75));  // 75% 
		this.Buttons.settingsCheckbox3.addEventListener('click', () => {
			this.isMuted = !this.isMuted; // Alterna el estado entre silenciado y no silenciado
			const volume = this.isMuted ? 0 : 0.3; // Cambia el volumen según el estado
			this.audioManager.setBackgroundMusicVolume(volume);
			console.log(`Música ${this.isMuted ? 'silenciada' : 'activada'}`);
		});
        this.Buttons.goBackSettings.addEventListener('click', () => this.goToScreen(this.Screens.MAIN));
        this.Buttons.highscore.addEventListener('click', () => this.goToScreen(this.Screens.HIGHSCORES));
        this.Buttons.goBackHighscores.addEventListener('click', () => this.goToScreen(this.Screens.MAIN));
        this.Buttons.joinRoom.addEventListener('click', () => this.startGame());
        this.Buttons.goBackRoom.addEventListener('click', () => this.goToScreen(this.Screens.USERNAME));
        this.Buttons.limitedTime.addEventListener('click', () => this.selectGameMode(0));
        this.Buttons.byLives.addEventListener('click', () => this.selectGameMode(1));
        this.Buttons.goBackMode.addEventListener('click', () => this.goToScreen(this.Screens.PLAYER));

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

        if(screen == this.Screens.HIGHSCORES){
            getHighscores()
            .then((highscores)=>{
                const highscoreList = document.getElementById('highscore-list-in-highscores'); // Asegúrate de tener este elemento en tu HTML
                highscoreList.innerHTML = '';
    
                highscores.forEach((score, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${score.name}: ${score.score}`;
                    highscoreList.appendChild(listItem);
                });
            })
        }
    }
    
	

    selectPlayerMode(mode) {
        this.playerModeSelected = mode;
        this.goToScreen(this.Screens.MODE);
    }
    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.goToScreen(this.Screens.MAP);

    }
    selectGameMode(mode) {
        this.gameMode = mode;
        this.goToScreen(this.Screens.DIFFICULTY);
    }

    selectMap(map) {
        this.mapSelected = map;

        this.camera.updateProjectionMatrix(); 
        if( document.getElementById('idNombreJugador').value == ''){
            this.goToScreen(this.Screens.USERNAME);
        }
        else {
            this.startGame();
        }
    }
    startConnection() {
      const player1Name = document.getElementById("idNombreJugador").value;
      this.socket.emit('start', player1Name);
    }
    joinRoom(){
        const player1Name = document.getElementById("idNombreJugador").value;
        this.room = document.getElementById("idRoom").value;
        this.socket.emit('joinRoom', this.room, {
            name: player1Name,
            position: { x: 2, y: 2, z: -2 },
        });
    }
    

	resizeWindow(size) {
		
		this.renderer.setSize(window.innerWidth * size, window.innerHeight * size);
		
		this.camera.aspect = window.innerWidth * size / window.innerHeight * size;
		this.camera.updateProjectionMatrix();
	}

	
	startGame() {
		this.gameController.player.name = document.getElementById('idNombreJugador').value;
		this.isGameRunning = true;
		this.gameController.isPlaying = true;
		this.goToScreen(this.Screens.GAME);
		this.renderer.setSize(this.Screens.GAME.clientWidth, this.Screens.GAME.clientHeight);
	
		// Establecer volumen de la música antes de cargarla
		const volume = this.isMuted ? 0 : 0.3; // Ajusta el volumen según el estado de isMuted
	
        if(this.gameMode ==0){
            document.getElementById('lives').setAttribute('hidden', 'true');
        }else{
            document.getElementById('time').setAttribute('hidden', 'true');
        }

        if(this.playerModeSelected == 1){
            this.startConnection();
            this.joinRoom();
        }


        if (this.mapSelected === 0){ 

            this.particlesToUpdate = city(this.scene);

            this.audioManager.loadBackgroundMusic('./src/sounds/pizza.mp3');
            this.camera.position.set(0, 6, -1);
            this.camera.lookAt(new THREE.Vector3(0, 2, -5));
            
            setupLighting(this.scene);
        }
        else if(this.mapSelected === 1){ 

            this.particlesToUpdate = beach(this.scene);

            this.audioManager.loadBackgroundMusic('./src/sounds/Sweet Sweet Canyon - Mario Kart 8 Deluxe OST.mp3');
            this.camera.position.set(0, 6, 0);
            this.camera.lookAt(new THREE.Vector3(0, 2.5, -5));
            setUpLightingBeach(this.scene);
        }
        else{ 
            this.particlesToUpdate = minecraft(this.scene);

            this.audioManager.loadBackgroundMusic('./src/sounds/room.mp3');
            this.camera.position.set(0, 6, 0);
            this.camera.lookAt(new THREE.Vector3(0, 2.5, -5));
            setUpLightingMinecraft(this.scene);
        }

        this.gameController.startspawnrat();
        this.clock.start();
        this.animate(this.isGameRunning, this.isGamePaused);
    }

    pauseGame() {
        this.isGamePaused = true;
        this.gameController.isPlaying = false;
        this.clock.stop();
        this.goToScreen(this.Screens.PAUSE);
    }

    resumeGame() {
        this.isGamePaused = false;
        this.gameController.isPlaying = true;
        this.goToScreen(this.Screens.GAME);
        this.renderer.setSize(this.Screens.GAME.clientWidth, this.Screens.GAME.clientHeight);
        this.clock.start();
        this.animate();
    }

    endGame() {
        this.isGameRunning = false;
        this.isGamePaused = false;
        this.clock.stop();
        this.goToScreen(this.Screens.GAMEOVER);

         // Obtener el nombre del jugador actual y su puntuación
        const playerName = this.gameController.player.name;
        const playerScore = this.gameController.points; 

        saveHighscore(playerName, playerScore)
        .then(() => {
            console.log('Highscore guardado correctamente');
            
            // Obtener el top 5 de highscores y mostrarlos
            return getHighscores();
        })
        .then((highscores)=>{
            console.log('Top 5 Highscores:', highscores);
            const highscoreList = document.getElementById('highscore-list'); // Asegúrate de tener este elemento en tu HTML
            highscoreList.innerHTML = '';

            highscores.forEach((score, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${score.name}: ${score.score}`;
                highscoreList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error('Error al manejar los high scores:', error);
        });
    }
}
