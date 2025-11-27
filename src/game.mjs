import { engine } from "./engine.mjs";
import * as THREE from "three";
import { createBall, ballMesh, ballBody } from "./ball.mjs";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let cameraController = null; // reserve a variable for OrbitControls instance, we use null to say “empty for now” we will asign it later

//light
function initLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(10, 30, 20);  // position in space
    light.lookAt(0, 0, 0);           // point toward center of scene

    light.castShadow = true;   // enables shadows
    engine.scene.add(light);
}

// --- Camera ---
function initCamera() {
    engine.camera.position.set(0, 20, 80); // starting view
    engine.camera.lookAt(0, 0, 0);         // look at scene origin
}

// --- Game ---
function initGame() {
    initCamera();
    initLight();

    createBall(0, 30, 0);    // Creates the ball


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
