import { Card } from "./Card";
import { CardArea } from "./CardArea";

export class Column extends CardArea {
    destination: Card;
    private childrenCount: number = 0;

    constructor(width: number, height: number) {
        super(width, height);

    }

    addCard(card: Card) {
        if (this.destination) {
            this.destination.addChild(card);
            this.destination = card;
            card.scale.set(1);
            card.position.set(0 + this.width + 68, 70);
        } else {
            this.addChild(card);
            this.destination = card;
            card.position.set(0 + card.width / 2, 0);
        }
        this.childrenCount++;
    }
}