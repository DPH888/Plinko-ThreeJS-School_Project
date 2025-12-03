import * as THREE from "three";
import * as CANNON from "cannon-es";
import { engine } from "./engine.mjs";

function createGround(x, y, z, width, height, depth) {
    // visible ground – THREE.JS
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
     why is divided by 2? Because Three.js and Cannon.es operate in a different ways
    
       Three.js BoxGeometry(100, 1, 100)   means "full width = 100 units"
       Cannon.es Box(...)                  means "distance from center to edge"*/
    const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    //  why new CANNON.Vec3(x, y, z) and not just x, y, z?
    //  Cannon.es is very strict: it ONLY accepts its own vector type.
    //  you cannot write position: {x, y, z} or use THREE.Vector3 it will just break
    const groundBody = new CANNON.Body({
        //  why new CANNON.Vec3(x, y, z) and not just x, y, z?
        //  Cannon.es is very strict: it ONLY accepts its own vector type.
        //  you cannot write position: {x, y, z} or use THREE.Vector3 it will just break                               
        position: new CANNON.Vec3(x, y, z),           // same starting position as the visual mesh
        shape: shape
    });

    engine.world.addBody(groundBody);     // add to physics simulation (gravity now affects it)

  // every Three.js object has a small hidden storage space called .userData
  // we put the physics body inside this lable so the engine can find it later and unite the physical and visual ball
    groundMesh.userData.body = groundBody;
}

export { createGround };