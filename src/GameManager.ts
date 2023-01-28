import { Card } from "./Card";
import * as PIXI from 'pixi.js';


export class GameManager {
    public draggingCard: Card;

    constructor(public app: PIXI.Application, private background: PIXI.Container) {

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

}