import * as THREE from "three";
import * as CANNON from "cannon-es";
import { engine, colisionChecker } from "./engine.mjs";
import { createBall, ballMesh, ballBody } from "./ball.mjs";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createGround } from "./ground.mjs"
import { createCylinder } from "./cylinder.mjs"
import { initLights } from "./lights.mjs"
import { createDetectionPoint, physicalBody } from "./detection_point.mjs"
import { createwords } from "./font.mjs"
let cameraController = null; //we use null to say “empty for now” we will asign it later

// camera initialisation
function initCamera() {
    engine.camera.position.set(0, 20, 80); // starting view
    engine.camera.lookAt(0, 0, 0);         // look at scene origin
}
// the initialisation of most base things for the game
function initGame() {
    initCamera();
    initLights();

    createwords()
    createDetectionPoint(-2, 2, -10, 5, 2, 5, 100);
    createDetectionPoint(-2, 2, 0, 5, 2, 5, 200);
    createDetectionPoint(-2, 2, 20, 5, 2, 5, 200);
    createDetectionPoint(-2, 2, 10, 5, 2, 5, 300);
    createDetectionPoint(-2, 2, 30, 5, 2, 5, 100);

    createBall(0, 60, engine.randomInteger(0, 15));    // Creates the ball

    createGround(-13, 0, 0, 30, 2, 100);
    createGround(3, 29, 0, 2, 60, 100)

    createGround(-1, 2, 5, 7, 6, 1)
    createGround(-1, 2, 15, 7, 6, 1)
    createGround(-1, 2, -5, 7, 6, 1)
    createGround(-1, 2, -15, 7, 6, 1)
    createGround(-1, 2, 25, 7, 6, 1)
    createGround(-1, 2, 35, 7, 6, 1)

    createGround(-5, 2, 10, 1, 6, 51)

    createGround(-5, 2, 10, 1, 90, 60,true)
// call this after you create the ball and the barrier
function createCylinderPyramid() {
    const verticalStep = 10;    // vertical distance between rows
    const horizontalStep = 10;   // horizontal spacing between cylinders
    const layers = 4;           // number of rows in pyramid
    const topCount = 3;         // number of cylinders in the top row

    for (let layer = 0; layer < layers; layer++) {   // the for loop goes through each layer of the pyramid, starting from the top
        // 1. How many cylinders in THIS specific row?
        // layer starts at 0 and goes 0 -> 1 -> etc.
        // the code adds the current layer number to the top row count
        // So: layer 0 -> 3+0 = 3 cylinders
        //     layer 1 -> 3+1 = 4 cylinders etc.
        const count = topCount + layer;         // Each lower layer has one more cylinder than the one above it
        // 2. What is the Y (height) position of THIS row?
        // top row starts at y = 40 
        // each time layer increases by 1, we move down by 10 units
        // layer 0 -> 40 - (0 x 10) = 40
        // layer 1 -> 40 - (1 x 10) = 30 etc.
        const y = 40 - layer * verticalStep;
        // 3. How much do we shift this row left/right to keep it centered?
        // Lower rows have more cylinders -> without offset they would stick out to the right
        // This line calculates exactly how much to shift the entire row to the left
        // layer 0: count = 3 -> (3-3) x 10 / 2 = 0 x 10 / 2 = 0      no offset
        // layer 1: count = 4 -> (3-4) x 10 / 2 = -1 x 10 / 2 = -5    shift left by 5 units etc.
        const rowOffset = (topCount - count) * horizontalStep / 2;
        for (let cylinderInRowPosition = 0; cylinderInRowPosition < count; cylinderInRowPosition++) {
            // start at the centered offset
            // then move right by 10 units for each next cylinder
            //  all cylinders in this row are evenly spaced
            // cylinderInRowPosition 0 -> z = -10 + 0x10 = -10
            // cylinderInRowPosition 1 -> z = -10 + 1x10 =   0 etc.
            const z = rowOffset + cylinderInRowPosition * horizontalStep;   
            createCylinder(-0.01, y, z, 2, 10, 64); // create cylinder
        }
    }
}
 createCylinderPyramid()
    // OrbitControls for camera rotation and zoom
    // OrbitControls isnt  directly used  because its just a blueprint (a class)
    // OrbitControls listens to mouse/touch events
    cameraController = new OrbitControls(engine.camera, engine.renderer.domElement);//  // engine.renderer.domElement is the actual canvas element where Three.js renders
    cameraController.enableDamping = true;       // smooth motion
    cameraController.dampingFactor = 0.1;        //sensitivity of the camera rotaion
    cameraController.enablePan = false;          // disable right-click moovements of camera(camera being able to move off its preset axis)
    cameraController.minDistance = 70;
    cameraController.maxDistance = 150;          // limits zoom out

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
