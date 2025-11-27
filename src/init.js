import { engine } from "./engine.mjs";
import { game } from "./game.mjs"
document.body.onload = () => {
    console.log("Front end scripts starting.");

    engine.init();

    game.init();
};