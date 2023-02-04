import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { Assets } from "./CardFactory";
import { GameManager } from "./GameManager";
import { LoadScreen } from "./components/LoadScreen";
import { EndScreen } from "./components/EndScreen";

const app = new PIXI.Application({
    width: 1140,
    height: 800,
    background: "#005000",
});
document.body.appendChild(app.view as HTMLCanvasElement);

let connection = null;

// Start load screen
const loadScreen = new LoadScreen(app);

// Load assets
PIXI.Assets.addBundle('images', {
    cards: '/assets/cards.jpg',
    logo: '/assets/logo.svg',
    logo2: '/assets/logo2.png',
    logo3: '/assets/logo3.png',
});

PIXI.Assets.loadBundle('images', (p) => loadScreen.progress(p))
    .then(res => loadScreen.on('destroyed', () => init(res)))
    .catch(e => new Error(e.message));


function init(assets: Assets) {
    const gameManager = new GameManager(app, assets);

    // const endScreen = new EndScreen(app, cardFactory, board, false);
}
/*

initForm.addEventListener('submit', async event => {
    event.preventDefault();
    const { nickname } = Object.fromEntries(new FormData(event.target as HTMLFormElement));

    connection = new Connection(nickname as string);
    await connection.open();
    engine(connection);
    showBoard();

    connection.send('startGame');
});

*/