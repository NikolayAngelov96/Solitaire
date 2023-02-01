import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { GameManager } from "./GameManager";

export class Column extends CardArea {

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

        window['c'] = this;
    }

    get destinationGlobalPosition() {
        const position = this.destination.getGlobalPosition();

        if (this.destination instanceof Card) {
            position.y += 30;
        }

        return position;
    }

    get destination() {
        return this.getDestination();
    }

    get cardsCount() {
        return this.getCardsCount();
    }

    private getDestination(current: any = this): Card | Column {
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
        if (this.cardsCount > 0 && card.suite == (this.destination as Card).suite) {
            return false;
        }

        return true;
    }
}