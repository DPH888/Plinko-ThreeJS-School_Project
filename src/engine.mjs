import * as THREE from "three";
import * as CANNON from "cannon-es";

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 40);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Physics world
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -10, 0) // gravity along -Y
});

// Simple ground so ball doesn't fall forever
const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI/2, 0, 0); // rotate plane to horizontal
world.addBody(groundBody);

// Engine update loop
function update() {
    world.step(1/60); // step physics

    // Sync meshes with physics bodies
    scene.traverse(obj => {
        if (obj.userData.body) {
            obj.position.copy(obj.userData.body.position);
            obj.quaternion.copy(obj.userData.body.quaternion);
        }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

// Minimal engine init function
function initEngine() {
    console.log("Engine initialized!");
    update();
}

export const engine = {
    scene,
    camera,
    renderer,
    world,
    update,
    init: initEngine
};
