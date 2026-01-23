import * as THREE from "three";
import * as CANNON from "cannon-es";
import { createBall, ballMesh, ballBody } from "./ball.mjs";
import{createDetectionPoint, physicalBody,GlobalScore} from "./detection_point.mjs"
let engine = {
    init: initEngine,     // method to initialize the engine
    update: () => {},
    updateTime: 10,      // milliseconds between each `engine.update()` call, smaller = faster game logic updates, larger = slower updates
    scene: null,      //THREE.js scene  //we use null to say “empty for now” we will asign it later
    camera: null,    // THREE.js camera
    renderer: null,      // draws the scene
    world: null,       // Cannon.es physics world

    randomInteger(min, max) { // returns a random integer between min and max 
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
// Sets up Three.js scene, camera, renderer, and Cannon.es physics
function initThreeAndPhysics() {
    engine.scene = new THREE.Scene(); // main container for all 3D objects

    engine.camera = new THREE.PerspectiveCamera(
        75,                                         // FOV in degrees
        window.innerWidth / window.innerHeight,         // aspect ratio of browser window
        0.1,                                //  minimum render distance:: objects closer than this won't appear
        1000                                 //   maximum render distance:: objects farther than this won't appea
    );
    //Renderer
    engine.renderer = new THREE.WebGLRenderer({ antialias: true });  // allows for the GPU to help with rendering
    engine.renderer.setSize(window.innerWidth, window.innerHeight);   // full window
    document.body.appendChild(engine.renderer.domElement); // // attach canvas to webpage


    engine.renderer.shadowMap.enabled = true; // Enable shadows
    engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // This sets the type of shadow mapping algorithm
    // Physics world
    engine.world = new CANNON.World();
    engine.world.gravity.set(0, -3, 0); // downward gravity
    /*
     SAPBroadphase is the first step of collision detection.
     the broadphase checks for which bodies might collide before doing precise calculations.
     it improves performence
    */
    engine.world.broadphase = new CANNON.SAPBroadphase(engine.world);
}
// Render loop: updates physics and draws the scene every frame
function renderLoop() {
    engine.world.step(1 / 60);   // physics step at 60 Hz, it regulates how fast or slow everything is mooving
    //colisionChecker is being called here because world.contacts is only valid after world.step() else it will start before it
        colisionChecker(ballBody, physicalBody); 
    /*  
    traverse() goes through every object in the scene 
    object.userData.body -> if the object has a physics body associated
    position.copy() -> copies physics body position to the mesh
    quaternion.copy()-> copies physics body rotation to the mesh
    This keeps the 3D visual representation exactly aligned with physics simulation.
   */
    engine.scene.traverse(object => {
        if (object.userData.body) {
            object.position.copy(object.userData.body.position);
            object.quaternion.copy(object.userData.body.quaternion);
        }
    });
    //Render Scene
    engine.renderer.render(engine.scene, engine.camera);     // Draws the scene from the perspective of the camera this sends commands to the GPU to render objects to the canvas
    /*
      requestAnimationFrame tells the browser:
      "Call this function before the next screen repaint"
      This makes rendering smooth and synced with monitor refresh rate (~60 FPS)
     */
    requestAnimationFrame(renderLoop);
}
 let hit = false;
//Colision checker between 2 objects
function colisionChecker(bodyA, bodyB) {
    if (hit == false) {
        // engine.world.contacts contains all the collisions detected(between 2 bodies)
        // looping through world.contacts is necessary because Cannon does not provide a direct "are these two bodies colliding" query
        for (let i = 0; i < engine.world.contacts.length; i++) {

            // it retrieves a single collision record from the physics world
            // "engine.world.contacts" is a list of all collisions currently detected in this physics step.
            // "i" specifies spesific collision in the list that is wanted
            // the variable "contact" now represents that specific collision including the two bodies involved (bodyOne and bodyTwo)
            const contact = engine.world.contacts[i];

            // contact.bi = first body in the contact pair
            // contact.bj = second body in the contact pair
            // cannon-es assigns these arbitrarily meaning bj and bi are not guaranteed to be bi or bj; bi and bj are given to us by cannon es we cannot set out own names
            const a = contact.bi;
            const b = contact.bj;

            // Check if this contact involves exactly bj and bi
            // We check both orders because bi and bj can be assigned in either order by the engine
            if ((a === bodyA && b === bodyB) || (a === bodyB && b === bodyA)) {
                hit = true;
                console.log("you got",GlobalScore);
        }
    }
} 
}

//Initializes engine and starts render + update loops
function initEngine() {
    initThreeAndPhysics();   // creates scene, camera, renderer, physics world
    window.engine = engine;     //This allows the engine’s variables to be used in other files or the console.”
    renderLoop();           // start visual render loop 

    /*
 * Start the logic update loop
 * setInterval calls engine.update() every updateTime milliseconds
 * This loop handles game logic, physics adjustments, camera follow, etc.
 */
    setInterval(() => engine.update(), engine.updateTime);
}

export { engine };
