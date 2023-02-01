import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { GameManager } from "./GameManager";

export class Foundation extends CardArea {

    constructor(width: number, height: number, gameManager: GameManager) {
        super(width, height);

        this.interactive = true;
        this.on('pointerup', () => {
            if (gameManager.draggingCard) {
                if (this.validateCard(gameManager.draggingCard)) {
                    gameManager.draggingCard.goTo(this);
                } else {
                    gameManager.draggingCard.goBack();
                }
            }
        });
    }

    get destinationGlobalPosition() {
        return this.getGlobalPosition();
    }

    get destination() {
        return this.getDestination();
    }

    get cardsCount() {
        return this.getCardsCount();
    }

    private getDestination(current: any = this): Card | Foundation {
        if (current.children.at(-1) instanceof Card) {
            return this.getDestination(current.children.at(-1));
        }

        return current;
    }

    private getCardsCount(current: any = this, count = 0): number {
        if (current.children.at(-1) instanceof Card) {
            count++;
            return this.getCardsCount(current.children.at(-1), count);
        }

        return count;
    }

    public validateCard(card: Card) {
        // Validate from the backend if the card can go in the column

        // Temporary solution
        if (this.cardsCount > 0 && card.suite != (this.destination as Card).suite || card.faceUp == false) {
            return false;
        }

        return true;
    }
}