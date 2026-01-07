import * as THREE from "three";   // imports the Three.js library 
import * as CANNON from "cannon-es"; // imports the Cannon-es physics library 
import { engine } from "./engine.mjs"; // our custom game engine 

let ballMesh;   // the visible red sphere on screen (Three.js)
let ballBody;   // the invisible physics sphere that falls, rolls, bounces (Cannon)

function createBall(x = 0, y = 10, z = 0) {
  // visual part – what the player actually sees
  const geometry = new THREE.SphereGeometry(2); // radius - 2 units

  const material = new THREE.MeshStandardMaterial({ // MeshStandardMaterial is a preset that comes with Three.js, it simulates real-world VISUAL materials
    color: 0xff0000,     //  red colour
    //  MeshStandardMaterial is realistic based rendering 
  });

  ballMesh = new THREE.Mesh(geometry, material);

  ballMesh.position.set(x, y, z);        // starting position 
  ballMesh.castShadow = true;            // casts a shadowl
  ballMesh.receiveShadow = true;

  engine.scene.add(ballMesh);            // Add to the 3D world so the camera can see it

  // physics part - invisible collision & movement
  const shape = new CANNON.Sphere(2);     // collision sphere with 2 units (same as visual)
 
  const ballPhysicsMaterial = new CANNON.Material(); //new CANNON.Material() creates a PHYSICS material
  // creating a complete physics body 
  // everything inside { } is just a normal  object with properties.
  // CANNON.Body is a class that creates the object using blueprint
  ballBody = new CANNON.Body({
    mass: 1,                
    
  //  why new CANNON.Vec3(x, y, z) and not just x, y, z?
  //  Cannon.es is very strict: it ONLY accepts its own vector type.
  //  you cannot write position: {x, y, z} or use THREE.Vector3 it will just break         
    position: new CANNON.Vec3(x, y, z),   // Same starting position as the visual mesh
    shape: shape,
    material: ballPhysicsMaterial                  // use the custom colour settings
  });

  engine.world.addBody(ballBody);      // Add to physics simulation (gravity now affects it)

  // every Three.js object has a small hidden storage space called .userData
  // we put the physics body inside this lable so the engine can find it later and unite the physical and visual ball
  ballMesh.userData.body = ballBody;
}

export { createBall, ballMesh, ballBody };