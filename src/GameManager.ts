import { Card } from "./components/Card";
import * as PIXI from 'pixi.js';
import { DesignPicker } from "./components/DesignPicker";
import { ConnectionDialogue } from "./components/ConnectionDialogue";
import { Assets, CardFactory } from "./CardFactory";
import { Board } from "./components/Board";


export class GameManager {
    public cardFactory: CardFactory;
    public board: Board;
    private _draggingCard: Card = null;
    public cards: Card[] = [];
    public cardsDealed = false;
    public dealLayer = new PIXI.Container();

    constructor(
        public app: PIXI.Application,
        public assets: Assets
    ) {
        this.cardFactory = new CardFactory(this);

        // Background to track mouse movement
        const background = new PIXI.Graphics();
        background.beginFill(0x005000);
        background.drawRect(0, 0, this.app.view.width, this.app.view.height);
        background.endFill();
        background.interactive = true;

        this.app.stage.addChild(background);
        this.board = new Board(this, this.cardFactory);
        this.app.stage.addChild(this.dealLayer);

        background.on('pointerup', () => this.draggingCard?.goBack());
        this.connectionDialogue();
    }

    set draggingCard(card: Card) {
        this._draggingCard = card;

        if (card) {
            this.app.stage.addChild(card);
        }
    }

    get draggingCard() {
        return this._draggingCard;
    }

    set cardsLogo(texture: PIXI.Texture) {
        this.cards.forEach((card: Card) => {
            card.backLogo = texture;
        });
    }

    public designPicker() {
        new DesignPicker(this.app, this, this.cardFactory);
    }

    public connectionDialogue(): void {
        new ConnectionDialogue(this.app, this, this.board.shuffleAndDealCards.bind(this.board));
    }

    public connect(nickname: string, dialogue: ConnectionDialogue) {
        console.log('Connecting ...');
        this.board.addPlayerNickname(nickname);
        dialogue.destroy({ children: true });
    }

    public restart() {
        this.cards.forEach(card => card.destroy());
        this.cardsDealed = false;
        this.cards.length = 0;
        this.board.deck.fill();
        this.connectionDialogue();
    }
}