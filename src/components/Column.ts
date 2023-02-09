import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { GameManager } from "../GameManager";

export class Column extends CardArea {

    constructor(width: number, height: number, gameManager: GameManager, public id: number) {
        super(width, height, gameManager);
    }

    override get destinationGlobalPosition() {
        const position = super.destinationGlobalPosition;

        if (this.destination instanceof Card) {
            position.y += 30;
        }

        return position;
    }

    public flipLastCard() {
        if (this.destination instanceof Card && this.destination.faceUp == false) {
            this.destination.flip();
        }
    }
}