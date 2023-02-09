import * as PIXI from 'pixi.js';
import { Assets } from "./CardFactory";
import { GameManager } from "./GameManager";
import { LoadScreen } from "./components/LoadScreen";

const app = new PIXI.Application({
    width: 1140,
    height: 800,
    background: "#005000",
});
document.body.appendChild(app.view as HTMLCanvasElement);

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

}