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

    public validateCard<T extends Card>(card: T) {
        // Validate from the backend if the card can go in the column

        // Temporary solution
        return (this.cardsCount == 0 && card.power == 12 && card.faceUp || card.faceUp && card.color !== (this.destination as T).color && card.power == (this.destination as T).power - 1);
    }

    public flipLastCard() {
        if (this.destination instanceof Card && this.destination.faceUp == false) {
            this.destination.flip();
        }
    }
}