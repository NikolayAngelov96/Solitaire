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
    const gameManager = new GameManager(app);
    const cardFactory = new CardFactory(assets, gameManager);
    const board = new Board(gameManager, cardFactory);
    board.addChild(disconnectBtn, hintBtn, cardsDesignBtn);
    app.stage.addChild(board);

    // board.dealCards();
    board.shuffleAndDealCards();
    // const endScreen = new EndScreen(app, cardFactory, board, false);
    cardsDesignBtn.attachEventListener('pointerdown', gameManager.designPicker.bind(gameManager));
}

const disconnectBtn = new Button('Disconnect', 150, 22, 85, 25, 0x28a745);

disconnectBtn.attachEventListener("pointerdown", () => {
    connection?.disconnect();
});

const hintBtn = new Button('Hint', 250, 22, 85, 25, 0x17a2b8);
hintBtn.attachEventListener('pointerdown', () => alert('This is very usefull hint'));

const cardsDesignBtn = new Button('Cards Design', 367, 22, 120, 25, 0x17a2b8);





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