import { CardArea } from "./CardArea";
import { CardFactory } from "./CardFactory";
import { GameManager } from "./GameManager";

export class Deck extends CardArea {

    constructor(width: number, height: number, private gameManager: GameManager, private cardFactory: CardFactory) {
        super(width, height);
        this.position.set(10 + width / 2, 50);
        this.interactive = true;
        this.fill();

        this.on('pointertapcapture', () => {
            if (this.gameManager.cardsDealed) {
                console.log('Flip card');
            }
        });
    }

    get destinationGlobalPosition() {
        return this.getGlobalPosition();
    }

    private fill() {
        for (let i = 0; i < 52; i++) {
            const card = this.cardFactory.getCard();
            card.x = card.width / 2;
            this.addChild(card);
            this.gameManager.cards.push(card);
        }
    }
}