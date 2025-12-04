import { engine } from "./engine.mjs";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { createBall, ballMesh, ballBody } from "./ball.mjs";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createGround } from "./ground.mjs"
import { createCylinder } from "./cylinder.mjs"
import { initLights } from "./lights.mjs"
let cameraController = null; //we use null to say “empty for now” we will asign it later

//light

// --- Camera ---
function initCamera() {
    engine.camera.position.set(0, 20, 80); // starting view
    engine.camera.lookAt(0, 0, 0);         // look at scene origin
}

// --- Game ---
function initGame() {
    initCamera();
    initLights();

    createBall(0, 20, engine.randomInteger(-5,5));    // Creates the ball
createGround(0, 0, 0,300, 2,200);
createGround(2, 10, 0, 0 ,200,400)
createCylinder(0, 10, 0,5, 8,64);

    // OrbitControls for camera rotation and zoom
    // OrbitControls isnt  directly used  because its just a blueprint (a class)
    // OrbitControls listens to mouse/touch events
    cameraController = new OrbitControls(engine.camera, engine.renderer.domElement);//  // engine.renderer.domElement is the actual canvas element where Three.js renders
    cameraController.enableDamping = true;       // smooth motion
    cameraController.dampingFactor = 0.1;        //sensitivity of the camera rotaion
    cameraController.enablePan = false;          // disable right-click moovements of camera(camera being able to move off its preset axis)
    cameraController.maxDistance = 90;          // limits zoom out

    engine.update = () => {
        // cameraController.target is the point where the camera rotates and zooms around
        // copy() sets it exactly to the current position of the ball
        cameraController.target.copy(ballMesh.position);

        // Apply camera rotation and damping
        cameraController.update();
    };
}

export const game = {
    init: initGame
};
