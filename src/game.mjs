import { engine } from "./engine.mjs";
import * as THREE from "three";
import { createBall } from "./ball.mjs";

// Lights
function initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    engine.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    engine.scene.add(dirLight);
}

// Init game
function initGame() {
    initLights();
    createBall(0, 50, 0); 
}

export const game = {

    init: initGame

};
