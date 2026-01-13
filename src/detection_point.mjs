import * as THREE from "three";
import * as CANNON from "cannon-es";
import { engine } from "./engine.mjs";
let physicalBody;
let visualBody; 
let GlobalScore=0; //globalScore and localScore have the same value, local score is used only as a local variable to the function createHoldInPlaceBox 
function createHoldInPlaceBox(x, y, z, width, height, depth,Localscore) {
       // the visible side - THREE.JS
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // this material has no shadows and reflections and red color
        // combines the shape(cannon-es) + the look(three.js) does creating the final visible ground
    var groundMesh = new THREE.Mesh(geometry, material);
    groundMesh.position.set(x, y, z)// starting position

    engine.scene.add(groundMesh);// add to the 3D world so the camera can see it
  /*PHYSICS – CANNON
        why using Vec3 and dividing by 2
       CANNON.Box() expects the distance from center to edge, so the full size must be divided by 2
       CANNON.Box() ONLY accepts a CANNON.Vec3 — nothing else works
    */
    visualBody = new CANNON.Box(
        new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    physicalBody = new CANNON.Body({
        // Cannon-es ONLY accepts its own CANNON.Vec3 for position, velocity, force, etc.                          
        position: new CANNON.Vec3(x, y, z),      // same starting position as the visual mesh
        shape: visualBody   // attach collision shape to the physics body
    });

    engine.world.addBody(physicalBody);
  // every Three.js object has a small hidden storage space called .userData
  // we put the physics body inside this lable so the engine can find it later and unite the physical and visual ball
    groundMesh.userData.body = physicalBody;

    GlobalScore=Localscore  //globalScore must be defined in the createHoldInPlaceBox function because the LocalScore variable is only local to the function
}
export { createHoldInPlaceBox, physicalBody, visualBody , GlobalScore};