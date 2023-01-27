import { Card } from "./Card";
import * as PIXI from 'pixi.js';


export class GameManager {
    public draggingCard: Card;

    constructor(private app: PIXI.Application) {

        this.app.stage.on('pointerdown', (e) => {
            if (e.target instanceof Card) {
                this.setDraggingCard(e.target as Card);
            }
        });

        this.app.stage.on('pointerup', (e) => {
            if (this.draggingCard) {
                this.clearDraggingCard();

            }
        });

    }

    private setDraggingCard(card: Card) {
        this.draggingCard = card;
        this.draggingCard.dragging = true;
        this.draggingCard.interactive = false;
        console.log('Set');

        this.app.stage.on('pointermove', (e) => {
            card.move(e);
            console.log('Move');
        });
    }

    private clearDraggingCard() {
        this.draggingCard.dragging = false;
        this.draggingCard.interactive = true;
        this.draggingCard = null;
        this.app.stage.off('pointermove');
        console.log('clear');
    }
}