import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { CardFactory } from "./CardFactory";
import { GameManager } from "./GameManager";

export class Deck extends CardArea {

    constructor(width: number, height: number, gameManager: GameManager, private cardFactory: CardFactory) {
        super(width, height);
        this.position.set(10 + width / 2, 50);

        this.interactive = true;
        this.fill();

        this.on('pointerupcapture', () => {
            if (gameManager.draggingCard) {
                gameManager.draggingCard.goTo(this);
                gameManager.draggingCard.disableEventListener();
                gameManager.draggingCard = null;
            }
        });
    }

    get destinationGlobalPosition() {
        return this.getGlobalPosition();;
    }

    private fill() {
        for (let i = 0; i < 52; i++) {
            const card = this.cardFactory.getCard();
            card.x = card.width / 2;
            card.slot = this;
            this.addChild(card);
        }
    };

    public addCard(card: Card) {
        this.addChild(card);
        card.slot = this;
        card.position.set(0 + card.width / 2, 0);
    }
}