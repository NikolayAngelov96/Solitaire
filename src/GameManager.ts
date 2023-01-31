import { Card } from "./Card";
import * as PIXI from 'pixi.js';
import { DesignPicker } from "./DesignPicker";


export class GameManager {
    public draggingCard: Card;
    public cards: Card[] = [];
    public sampleCards = [];

    constructor(
        public app: PIXI.Application,
        public background: PIXI.Container
    ) {

        this.background.on('pointerupcapture', () => {
            if (this.draggingCard) {
                // Card to go back to old pile
                this.draggingCard.goBack();
                this.draggingCard = null;
            }
            console.log('background pointer up');
        });

    }

    public setDraggingCard(card: Card) {
        // Move the card to the stage
        this.draggingCard = card;
        this.app.stage.addChild(this.draggingCard);
    }

    public designPicker() {
        new DesignPicker(this.app, this);
    }
}