import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { GameManager } from "../GameManager";

export class Column extends CardArea {

    constructor(width: number, height: number, gameManager: GameManager) {
        super(width, height, gameManager);

        window['c'] = this;
    }

    override get destinationGlobalPosition() {
        const position = super.destinationGlobalPosition;

        if (this.destination instanceof Card) {
            position.y += 30;
        }

        return position;
    }
}