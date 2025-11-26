import * as THREE from "three";
import * as CANNON from "cannon-es";
import { engine } from "./engine.mjs";

let ballMesh, ballBody;

function createBall(x, y, z) {
  // THREE.JS mesh
    // Create sphere geometry
    const ballGeometry = new THREE.SphereGeometry(2, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
     // Create the THREE mesh
    ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
      // Set initial position
  ballMesh.position.set(x, y, z);
     // Add the mesh to the visual(THREE.js) scene
    engine.scene.add(ballMesh);

    // CANNON.js physics ball
    // Create spherical collision shape for physics
    const ballShape = new CANNON.Sphere(2);//2 is radius of 2 unit
    const ballMaterialPhysics = new CANNON.Material(); // Create a new material
    ballMaterialPhysics.friction = 1;
    ballMaterialPhysics.restitution = 1.3;// bounciness
    
     // Create CANNON body with mass and shape
    ballBody = new CANNON.Body({ 
      mass: 1, 
      position: new CANNON.Vec3(x, y, z), // Start position
      shape: ballShape,
      material: ballMaterialPhysics,
     });
    // Link visual mesh to its physics body
    ballMesh.userData.body = ballBody;

    engine.scene.add(ballMesh);
    engine.world.addBody(ballBody);



}
export { createBall, ballMesh, ballBody, };
