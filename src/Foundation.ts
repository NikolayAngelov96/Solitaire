import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { GameManager } from "./GameManager";

export class Foundation extends CardArea {

    constructor(width: number, height: number, gameManager: GameManager) {
        super(width, height, gameManager);

    }

    public override validateCard(card: Card) {
        // Validate from the backend if the card can go in the column

        // Temporary solution
        if (this.cardsCount > 0 && card.suite != (this.destination as Card).suite || card.faceUp == false) {
            return false;
        }

        return true;
    }
}