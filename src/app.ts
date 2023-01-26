import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { Board } from "./Board";
import { Button } from "./Button";

const initForm = document.querySelector('form');
const initSection = document.getElementById('init');
const gameSection = document.getElementById('game');

let connection = null;

const app = new PIXI.Application({
    width: 1140,
    height: 670,
    background: "#005000",
});

showBoard();

document.getElementById("board").appendChild(app.view as HTMLCanvasElement);

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