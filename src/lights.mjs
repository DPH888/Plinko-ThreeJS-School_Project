import * as THREE from "three";
import { engine } from "./engine.mjs";

function initLights() {
    //main directinal light
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(20, 40, 20);  // positioned high and to the side
    light.castShadow = true;

    // shadow map
    light.shadow.mapSize.set(2048, 2048);
    // defines the area where shadows are calculated based on the camera
    light.shadow.camera.near = 1;   // defines the closest distance from which shadows start to being rendered
    light.shadow.camera.far = 120;   //defines the exact volume in which shadows are calculated


    // these four values define a rectangle on the ground, everything outside this rectangle gets NO shadows at all
    light.shadow.camera.left = -80;
    light.shadow.camera.right = 80;
    light.shadow.camera.top = 80;
    light.shadow.camera.bottom = -80;
    // improve shadow quality
    light.shadow.bias = -0.0001; // Shifts the entire shadow map slightly closer to the light
    light.shadow.normalBias = 0.02; //removes dark spots on curved or angled surfaces
    engine.scene.add(light);

    // soft global illumination that lights all objects equally - perent objects from being partially or fully black for no reason
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    engine.scene.add(ambient);
}

export { initLights };
