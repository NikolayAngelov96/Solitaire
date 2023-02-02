import { Card } from "./Card";
import * as PIXI from 'pixi.js';
import { DesignPicker } from "./components/DesignPicker";
import { SampleCard } from "./SampleCard";
import { ConnectionDialogue } from "./components/ConnectionDialogue";


export class GameManager {
    private _draggingCard: Card = null;
    public cards: Card[] = [];
    public getSampleCards: () => SampleCard[];
    public cardsDealed = false;

    constructor(
        public app: PIXI.Application
    ) {
        // Background to track mouse movement
        const background = new PIXI.Graphics();
        background.beginFill(0x005000);
        background.drawRect(0, 0, this.app.view.width, this.app.view.height);
        background.endFill();
        background.interactive = true;
        this.app.stage.addChild(background);

        background.on('pointerup', () => this.draggingCard?.goBack());
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
        new DesignPicker(this.app, this);
    }

    public connectionDialogue(shuffleAndDealCards: () => void): void {
        new ConnectionDialogue(this.app, this, shuffleAndDealCards);
    }

    public connect(nickName: string, dialogue: ConnectionDialogue) {
        console.log('Connecting ...');

        dialogue.destroy();
    }
}