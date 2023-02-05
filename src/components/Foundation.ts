import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { GameManager } from "../GameManager";

export class Foundation extends CardArea {

    constructor(width: number, height: number, gameManager: GameManager) {
        super(width, height, gameManager);

    }

    public validateCard(card: Card) {
        // Validate from the backend if the card can go in the column
        return (card.faceUp == true && this.cardsCount > 0 && card.suite == (this.destination as Card).suite && card.power == (this.destination as Card).power + 1 ||
            card.faceUp == true && this.cardsCount == 0 && card.power == 0);
    }
}