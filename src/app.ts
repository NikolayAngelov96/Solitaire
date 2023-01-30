import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { Board } from "./Board";
import { Button } from "./Button";
import { Assets, CardFactory } from "./CardFactory";
import { GameManager } from "./GameManager";
import { cardSize } from "./Constants";
import { LoadScreen } from "./LoadScreen";
import { EndScreen } from "./EndScreen";

const app = new PIXI.Application({
    width: 1140,
    height: 670,
    background: "#005000",
});
document.body.appendChild(app.view as HTMLCanvasElement);

let connection = null;

// Background to track mouse movement
const background = new PIXI.Graphics();
background.beginFill(0x005000);
background.drawRect(0, 0, 1140, 670);
background.endFill();
background.interactive = true;
app.stage.addChild(background);

// Start load screen
const loadScreen = new LoadScreen(app);

// Load assets
PIXI.Assets.addBundle('images', {
    cards: '/assets/cards.jpg',
    logo: '/assets/logo.svg'
});

PIXI.Assets.loadBundle('images', (p) => loadScreen.progress(p))
    .then(res => loadScreen.on('destroyed', () => init(res)));


function init(assets: Assets) {
    const gameManager = new GameManager(app, background);
    const cardFactory = new CardFactory(assets, gameManager);
    const board = new Board(gameManager, cardFactory);
    board.addChild(disconnectBtn, hintBtn);
    app.stage.addChild(board);
    board.dealCards();

    // const endScreen = new EndScreen(app, cardFactory, board, false);
}

const disconnectBtn = new Button('Disconnect', 150, 22, 85, 25, 0x28a745);

disconnectBtn.attachEventListener("pointerdown", () => {
    connection?.disconnect();
});

const hintBtn = new Button('Hint', 250, 22, 85, 25, 0x17a2b8);
hintBtn.attachEventListener('pointerdown', () => alert('This is very usefull hint'));




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