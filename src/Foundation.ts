import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { Suites } from './Constants';
import { GameManager } from "./GameManager";

export class Foundation extends CardArea {

    public suite: Suites;

    constructor(width: number, height: number, suite: Suites, gameManager: GameManager) {
        super(width, height);

        this.suite = suite;

        this.interactive = true;
        this.on('pointerupcapture', () => {
            if (gameManager.draggingCard) {
                gameManager.draggingCard.goTo(this);
                // this.addCard(gameManager.draggingCard);
                // gameManager.draggingCard.goBack();
                gameManager.draggingCard.disableEventListener();
                gameManager.draggingCard = null;
            }
        });
    }

    get destinationGlobalPosition() {
        const position = this.getGlobalPosition();
        position.x += this.width / 2;
        return position;
    }

    addCard(card: Card): void {
        if (card.suite == this.suite) {
            this.addChild(card);
            card.position.set(0 + card.width / 2, 0);
        } else {
            card.goBack();
        }
    };
}