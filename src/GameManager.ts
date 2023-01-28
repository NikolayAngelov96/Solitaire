import { Card } from "./Card";
import * as PIXI from 'pixi.js';


export class GameManager {
    public draggingCard: Card;

    constructor(private app: PIXI.Application) {

        // Clear dragging card on pointerup anywhere on the canvas
        this.app.stage.on('pointerup', () => {
            if (this.draggingCard) {
                this.clearDraggingCard();
            }
        });
    }

    public setDraggingCard(card: Card) {
        this.draggingCard = card;
        this.app.stage.addChild(this.draggingCard);
        this.app.stage.on('pointermove', (e) => {
            this.draggingCard.move(e);
        });
    }

    public clearDraggingCard() {
        this.draggingCard = null;
        this.app.stage.off('pointermove');
    }
}