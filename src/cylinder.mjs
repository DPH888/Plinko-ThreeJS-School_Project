import * as THREE from "three";
import * as CANNON from "cannon-es";
import { engine } from "./engine.mjs";

function createCylinder(x, y, z, radius, height, segments) {
    // visible cylinder – THREE.JS
    const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
    const material = new THREE.MeshStandardMaterial({     //  MeshStandardMaterial is realistic based rendering 
        color: 0x0088ff,            //blue
        emissive: 0x0088ff,      // make the blue glow
    });
    // combines the shape(cannon) + the look(three) does creating the final visible cylinder
    const cylinderMesh = new THREE.Mesh(geometry, material);
    cylinderMesh.rotation.z = Math.PI / 2;  // rotate 90° around Z-axis for the THREE.JS(visual)
    cylinderMesh.position.set(x, y, z); // starting position 
    cylinderMesh.receiveShadow = true;

    engine.scene.add(cylinderMesh); // add to the 3D world so the camera can see it

    /*PHYSICS – CANNON
     why Vec3 and deviding by 2 is not in usage (unlike box):
     CANNON.Cylinder wants full radius + full height
     CANNON.Box() wants distance from center to edge, that's why Box needs /2 + Vec3
    CANNON.Cylinder only accepts 4 raw numbers does Vec3 would break it!*/
    const shape = new CANNON.Cylinder(radius, radius, height, segments)
    const cylinderBody = new CANNON.Body({
        // Cannon-es ONLY accepts its own CANNON.Vec3 for position, velocity, force, etc.                                 
        position: new CANNON.Vec3(x, y, z),           // same starting position as the visual mesh
        shape: shape     // attach collision shape to the physics body
    });
    cylinderBody.quaternion.setFromAxisAngle(  // Rotate 90 degrees around Z-axis
        new CANNON.Vec3(0, 0, 1),  // preselect the axis in which our cylinder will be rotated Z
        Math.PI / 2               // angle: 90 degrees
    );

    engine.world.addBody(cylinderBody);     // add to physics simulation (gravity now affects it)

    // every Three.js object has a small hidden storage space called .userData
    // we put the physics body inside this lable so the engine can find it later and unite the physical and visual ball
    cylinderMesh.userData.body = cylinderBody;
}

export { createCylinder };