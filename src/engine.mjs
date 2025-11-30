import * as THREE from "three";
import * as CANNON from "cannon-es";

let engine = {
    init: initEngine,     // method to initialize the engine
    update: () => {},
    updateTime: 10,      // milliseconds between each `engine.update()` call, smaller = faster game logic updates, larger = slower updates
    scene: null,      //THREE.js scene  //we use null to say “empty for now” we will asign it later
    camera: null,    // THREE.js camera
    renderer: null,      // WebGL renderer: draws the scene using GPU acceleration
    world: null,       // Cannon.js physics world

    randomInteger(min, max) { // returns a random integer between min and max 
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
    // Sets up Three.js scene, camera, renderer, and Cannon.js physics
function initThreeAndPhysics() {
    engine.scene = new THREE.Scene(); // main container for all 3D objects

    engine.camera = new THREE.PerspectiveCamera(
        75,                                         // FOV in degrees
        window.innerWidth / window.innerHeight,         // aspect ratio of browser window
        0.1,                                //  minimum render distance:: objects closer than this won't appear
        1000                                 //   maximum render distance:: objects farther than this won't appea
    );
    //Renderer
    engine.renderer = new THREE.WebGLRenderer({ antialias: true });  // GPU-accelerated canvas
    engine.renderer.setSize(window.innerWidth, window.innerHeight);   // full window
    document.body.appendChild(engine.renderer.domElement); // // attach canvas to webpage

    // Physics world
    engine.world = new CANNON.World();
    engine.world.gravity.set(0, -3, 0); // downward gravity
     /*
      Broadphase is the first step of collision detection.
      Cannon.js checks for which bodies might collide before doing precise calculations.
      SAPBroadphase (Sweep and Prune) is efficient for many objects.
     */
    engine.world.broadphase = new CANNON.SAPBroadphase(engine.world);

    // ground 
    const ground = new CANNON.Body({
        type: CANNON.Body.STATIC,           // does not move
        shape: new CANNON.Plane()           // flat horizontal plane
    });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // rotate to horizontal
    engine.world.addBody(ground);
}
            // Render loop: updates physics and draws the scene every frame
function renderLoop() {
    engine.world.step(1 / 60); // physics step at 60 Hz
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
    engine.renderer.render(engine.scene, engine.camera);     // Draws the scene from the perspective of the camera this sends commands to the GPU to render objects to the canvas#
    /*
      requestAnimationFrame tells the browser:
      "Call this function before the next screen repaint"
      This makes rendering smooth and synced with monitor refresh rate (~60 FPS)
     */
    requestAnimationFrame(renderLoop);
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
