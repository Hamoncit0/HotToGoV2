import { city, beach } from "../scene/backgroundModels.js";

export function screenController(container, renderer, clock, animate, scene){
    let isGameRunning = false;
    let isGamePaused = false;

    //PANTALLAS
    const Screens = {
        MAIN: document.getElementById('game-ui'),
        PAUSE: document.getElementById('pause-menu'),
        PLAYER: document.getElementById('player-mode'),
        MAP: document.getElementById('map-selector'),
        USERNAME: document.getElementById('username-input'),
        GAMEOVER: document.getElementById('game-over'),
        GAME: container
    };

    //BOTONES
    const Buttons = {
        play: document.getElementById('play-btn'),
        singlePlayer: document.getElementById('singleplayer-btn'),
        multiPlayer: document.getElementById('multiplayer-btn'),
        city: document.getElementById('select-city'),
        beach: document.getElementById('select-beach'),
        join: document.getElementById('join-btn'),
        end: document.getElementById('end-btn'),
        goBackPlayer: document.getElementById('go-back-player'),
        goBackMap: document.getElementById('go-back-map'),
        goBackUser: document.getElementById('go-back-username'),
        continue: document.getElementById('resume-btn'),
    }

    let actualScreen = Screens.MAIN;
    var playerModeSelected = 0; // 0 si es single player y 1 si es multiplayer
    var mapSelected = 0; // 0 si es ciudad y 1 si es playa

    Buttons.play.addEventListener('click', ()=>{
        goToScreen(Screens.PLAYER);
    })
    
    //SELECT PLAYER MODE
    Buttons.singlePlayer.addEventListener('click', ()=>{
        playerModeSelected = 0;
        goToScreen(Screens.MAP);
    })
    Buttons.multiPlayer.addEventListener('click', ()=>{
        playerModeSelected = 1;
        goToScreen(Screens.MAP);
    })

    //SELECT MAP
    Buttons.city.addEventListener('click', ()=>{
        mapSelected = 0;
        if(playerModeSelected == 0)
        startGame()
        else if(playerModeSelected == 1)
        goToScreen(Screens.USERNAME);
    })
    Buttons.beach.addEventListener('click', ()=>{
        mapSelected = 1;
        if(playerModeSelected == 0)
        startGame()
        else if(playerModeSelected == 1)
        goToScreen(Screens.USERNAME);
    })
    Buttons.join.addEventListener('click', startGame);
    Buttons.continue.addEventListener('click', resumeGame)
    
    //GO BACK BUTTONS FUNCTIONALITY
    Buttons.end.addEventListener('clcik', ()=>{goToScreen(Screens.MAIN)});
    Buttons.goBackPlayer.addEventListener('click', ()=>{goToScreen(Screens.MAIN)});
    Buttons.goBackMap.addEventListener('click', ()=>{goToScreen(Screens.PLAYER)});
    Buttons.goBackUser.addEventListener('click', ()=>{goToScreen(Screens.MAP)});

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isGameRunning && !isGamePaused) {
            pauseGame();
        }
        else if(event.key === 'Escape' && isGameRunning && isGamePaused)
            resumeGame();
    });

    function goToScreen(screen){
        actualScreen.style.display = 'none';
        actualScreen = screen;
        actualScreen.style.display = 'block';
    }

    function startGame() {
        isGameRunning = true;
        actualScreen.style.display = 'none';
        Screens.GAME.style.display = 'block';
        renderer.setSize(Screens.GAME.clientWidth, Screens.GAME.clientHeight);
        if(mapSelected == 0){
            city(scene);
        }
        else if(mapSelected == 1){
            beach(scene);
        }
        clock.start();
        animate(isGameRunning, isGamePaused);
    }

    function pauseGame() {
        isGamePaused = true;
        clock.stop();
        Screens.GAME.style.display = 'none';
        Screens.PAUSE.style.display = 'block';
    }

    function resumeGame() {
        isGamePaused = false;
        Screens.GAME.style.display = 'block';
        Screens.PAUSE.style.display = 'none';
        renderer.setSize(Screens.GAME.clientWidth, Screens.GAME.clientHeight);
        clock.start();
        animate();
    }

    function endGame() {
        isGameRunning = false;
        isGamePaused = false;
        clock.stop();
        Screens.PAUSE.setAttribute('hidden', true);
        Screens.GAMEOVER.style.display = 'block';
        Screens.GAME.setAttribute('hidden', true);
    }
    

}