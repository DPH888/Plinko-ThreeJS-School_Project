import * as THREE from "three";
import { engine } from "./engine.mjs";

function initLights() {
    //main directinal light
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    engine.scene.add(light);

    // soft global illumination that lights all objects equally - its used because objects being are being partially or fully black 
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    engine.scene.add(ambient);
}

export { initLights };
