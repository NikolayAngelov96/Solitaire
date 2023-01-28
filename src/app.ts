import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { Board } from "./Board";
import { Button } from "./Button";
import { Assets, Deck } from "./Deck";
import { GameManager } from "./GameManager";
import { Card } from "./Card";

const initForm = document.querySelector('form');
const initSection = document.getElementById('init');
const gameSection = document.getElementById('game');

let connection = null;

const app = new PIXI.Application({
    width: 1140,
    height: 670,
    background: "#005000",
});

// Background to track mouse movement
const background = new PIXI.Graphics();
background.beginFill(0x005000);
background.drawRect(0, 0, 1140, 670);
background.endFill();
background.interactive = true;

app.stage.addChild(background);


showBoard();

document.getElementById("board").appendChild(app.view as HTMLCanvasElement);

// Load assets
PIXI.Assets.addBundle('images', {
    cards: '/assets/cards.jpg',
    logo: '/assets/logo.svg'
});

PIXI.Assets.loadBundle('images',
    (p) => {
        console.log(`Progress: ${p * 100}%`);
    })
    .then(res => init(res));

function init(assets: Assets) {
    const gameManager = new GameManager(app, background);
    const deck = new Deck(assets, gameManager);
    const board = new Board(137, 208, gameManager);
    board.addChild(disconnectBtn, hintBtn);
    app.stage.addChild(board);

    const card = deck.getCard();
    card.setFront('KC');
    const card2 = deck.getCard();
    card2.setFront('AD');
    // const card3 = deck.getCard();
    // card3.setFront('JC');
    // const card4 = deck.getCard();
    // card4.setFront('QC');
    // const card5 = deck.getCard();
    // card5.setFront('JC');
    // const card6 = deck.getCard();
    // card6.setFront('QC');

    board.columns[5].addCard(card);
    board.columns[6].addCard(card2);
    // board.columns[1].addCard(card2);
    // board.columns[1].addCard(card3);
    // board.columns[2].addCard(card4);
    // board.columns[2].addCard(card5);
    // board.columns[2].addCard(card6);
}



const disconnectBtn = new Button('Disconnect', 100, 10, 85, 25, 0x28a745);

disconnectBtn.attachEventListener("pointerdown", () => {
    connection?.disconnect();
    showInit();
});

const hintBtn = new Button('Hint', 200, 10, 85, 25, 0x17a2b8);
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

function showBoard() {
    initSection.style.display = 'none';
    gameSection.style.display = 'block';
}

function showInit() {
    initSection.style.display = 'block';
    gameSection.style.display = 'none';
}
(window as any).app = app;