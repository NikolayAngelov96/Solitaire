import { Container, Graphics } from "pixi.js";
import { Card } from "./Card";

export class Column extends Container {
    destination: Card
    private childrenCount: number = 0;
    private placeholderColor: number = 0x196119;

    constructor(width: number, height: number) {
        super();

        this.createArea(width, height);
    }

    private createArea(width: number, height: number) {
        const area = new Graphics();
        area.beginFill(this.placeholderColor);
        area.drawRoundedRect(0, 0, width, height, 12);
        area.endFill();

        this.addChild(area);
    }

    addCard(card: Card) {
        if (this.destination) {
            this.destination.addChild(card);
            this.destination = card;
            card.scale.set(1);
            card.position.set(0 + this.width + 68, (this.childrenCount) * 35)
        } else {
            this.addChild(card);
            this.destination = card;
            card.position.set(0 + this.width / 2 - 15, 0)
        }
        this.childrenCount++;
    }
}