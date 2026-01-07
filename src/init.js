import { engine } from "./engine.mjs";
import { game } from "./game.mjs"
document.body.onload = () => {

    engine.init();

    game.init();
};