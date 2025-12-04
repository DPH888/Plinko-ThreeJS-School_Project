import * as THREE from "three";
import * as CANNON from "cannon-es";
import { engine } from "./engine.mjs";

function createGround(x, y, z, width, height, depth) {
    // visible ground - THREE.JS
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({     //  MeshStandardMaterial is realistic based rendering 
        color: 0x00aa00,      // green
    });

    // combines the shape(cannon) + the look(three) does creating the final visible ground
    const groundMesh = new THREE.Mesh(geometry, material);

    groundMesh.position.set(x, y, z); // starting position 
    groundMesh.receiveShadow = true;

    engine.scene.add(groundMesh); // add to the 3D world so the camera can see it

    /*PHYSICS – CANNON
        why using Vec3 and dividing by 2
       CANNON.Box() expects the distance from center to edge, so the full size must be divided by 2
       CANNON.Box() ONLY accepts a CANNON.Vec3 — nothing else works
    */
    const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    const groundBody = new CANNON.Body({
        // Cannon-es ONLY accepts its own CANNON.Vec3 for position, velocity, force, etc.                          
        position: new CANNON.Vec3(x, y, z),      // same starting position as the visual mesh
        shape: shape   // attach collision shape to the physics body
    });

    engine.world.addBody(groundBody);     // add to physics simulation (gravity now affects it)

  // every Three.js object has a small hidden storage space called .userData
  // we put the physics body inside this lable so the engine can find it later and unite the physical and visual ball
    groundMesh.userData.body = groundBody;
}

export { createGround };