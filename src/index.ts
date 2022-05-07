// Game
import Main from "./Main";

// Style
import "./style/layout.less";

document.getElementById("year").innerText = new Date().getFullYear().toString();

// Setup the game
new Main();
