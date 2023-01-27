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
app.stage.addChild(background);
app.stage.interactive = true;


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
    const gameManager = new GameManager(app);
    const deck = new Deck(assets);

    const card = deck.getCard();
    card.setFront('KH');

    const card2 = deck.getCard();
    card2.setFront('AH');
    card.addChild(card2);



    // const card3 = deck.getCard();
    // card3.setFront('JH');
    // const card4 = deck.getCard();
    // card4.setFront('QH');
    app.stage.addChild(card, card2);
}


const board = new Board(137, 208);


addGameTitle();



const disconnectBtn = new Button('Disconnect', 100, 10, 85, 25, 0x28a745);

disconnectBtn.attachEventListener("pointerdown", () => {
    connection?.disconnect();
    showInit();
});

const hintBtn = new Button('Hint', 200, 10, 85, 25, 0x17a2b8);
hintBtn.attachEventListener('pointerdown', () => alert('This is very usefull hint'));


board.addChild(disconnectBtn, hintBtn);

app.stage.addChild(board);

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

function addGameTitle() {
    const title = new PIXI.Text('Solitaire', {
        fill: 'white',
        fontSize: 20
    });

    title.position.set(10, 10);
    board.addChild(title);
}
(window as any).app = app;