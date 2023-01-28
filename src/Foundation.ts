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
            this.addCard(gameManager.draggingCard)
            gameManager.draggingCard.goBack();
            gameManager.draggingCard = null;
        })
    }

    addCard(card: Card): void {
        if (card.suite == this.suite) {
            this.addChild(card);
            card.position.set(0 + card.width / 2, 0);
        }
    };
}