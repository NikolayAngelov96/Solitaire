import { Card } from "./Card";
import * as PIXI from 'pixi.js';
import { DesignPicker } from "./DesignPicker";
import { SampleCard } from "./SampleCard";


export class GameManager {
    public draggingCard: Card;
    public cards: Card[] = [];
    public sampleCards: SampleCard[] = [];

    constructor(
        public app: PIXI.Application,
        public background: PIXI.Container
    ) {

        this.background.on('pointerupcapture', () => {
            if (this.draggingCard) {
                this.draggingCard.goBack();
                this.draggingCard = null;
            }
        });
    }

    set cardsLogo(texture: PIXI.Texture) {
        this.cards.forEach((card: Card) => {
            card.setBackLogo = texture;
        });
    }

    public setDraggingCard(card: Card) {
        this.draggingCard = card;
        this.app.stage.addChild(this.draggingCard);
    }

    public designPicker() {
        new DesignPicker(this.app, this);
    }
}