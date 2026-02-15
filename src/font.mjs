import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE from 'three';
import { engine } from "./engine.mjs";

// importing a typeface/font (build in three.js font)
import TypeOfFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

function createwords() {
  const loader = new FontLoader();// initialize the font loader

    // .parse() turns the raw JSON into a real Three.js Font object
    // TextGeometry needs this parsed font, because it can't use raw JSON directly.
  const font = loader.parse(TypeOfFont);

  const geometry = new TextGeometry('Score :', {
    font: font,               // loading the font
    size: 8,
    depth:5,
    curveSegments: 20,   //numbers of points on the curves(the more, it looks more smooth)
    bevelEnabled: true,  //enabaling bevel chamfered edges
    bevelThickness: 1,  //the depth of the bevel
    bevelSize: .5,     //the distance from the shape outline that the bevel extends
    bevelSegments: 10  //the number of bevel layers
  });
  const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);

mesh.position.y= 35
mesh.position.z= 35

mesh.rotation.z = Math.PI /0.5
mesh.rotation.y = Math.PI /0.1335; 
  engine.scene.add(mesh);
}

export { createwords };