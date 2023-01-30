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
    const board = new Board(cardSize.w, cardSize.h, gameManager, cardFactory);
    board.addChild(disconnectBtn, hintBtn);
    app.stage.addChild(board);


    const card = cardFactory.getCard();
    card.setFront('KC');
    const card2 = cardFactory.getCard();
    card2.setFront('AD');
    const card3 = cardFactory.getCard();
    card3.setFront('JC');
    const card4 = cardFactory.getCard();
    card4.setFront('QC');
    const card5 = cardFactory.getCard();
    card5.setFront('JC');
    const card6 = cardFactory.getCard();
    card6.setFront('QC');

    board.columns[0].addCard(card);
    board.columns[4].addCard(card2);
    board.columns[1].addCard(card2);
    board.columns[1].addCard(card3);
    board.columns[2].addCard(card4);
    board.columns[2].addCard(card5);
    board.columns[2].addCard(card6);

    const blur = new PIXI.BlurFilter();
    board.filters = [blur];

    const btn = new Button('New Game', app.stage.width / 2, app.stage.height / 2, 145, 38, 0x28a745)
    btn.attachEventListener('pointerdown', () => {
        window.location.reload();
    })
    const endScreen = new EndScreen(app, cardFactory, false, btn);
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