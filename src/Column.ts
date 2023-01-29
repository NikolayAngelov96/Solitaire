import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { GameManager } from "./GameManager";

window['columns'] = [];

export class Column extends CardArea {
    private childrenCount: number = 0;

    constructor(width: number, height: number, gameManager: GameManager) {
        super(width, height);
        this.interactive = true;
        this.on('pointerupcapture', (e) => {
            if (gameManager.draggingCard) {
                gameManager.draggingCard.goTo(this);
                // this.addCard(gameManager.draggingCard);
                // gameManager.draggingCard.goBack();
                gameManager.draggingCard.disableEventListener();
                gameManager.draggingCard = null;
            }
            console.log('Column pointer Up');
        });

        window['columns'].push(this);
    }

    get destinationGlobalPosition() {
        const position = this.destination.getGlobalPosition();

        if (this.destination instanceof Column) {
            position.x += this.destination.width / 2;
        }

        if (this.destination instanceof Card) {
            position.y += 30;
        }

        return position;
    }

    get destination() {
        return this.getDestination();
    }

    private getDestination(current: any = this) {
        if (current.children.at(-1) instanceof Card) {
            return this.getDestination(current.children.at(-1));
        }

        return current;
    }

    public addCard(card: Card) {
        this.destination.addChild(card);
        card.position.set(0 + card.width / 2, 0);

        if (card.parent instanceof Card) {
            card.position.set(0 + card.width / 2, 30);
        }
    }

    // addCard(card: Card) {
    //     if (this.destination) {
    //         this.destination.addChild(card);
    //         this.destination = card;
    //         card.position.set(0 + this.width + 68, 70);
    //         card.scale.set(1);
    //         console.log(this.width);
    //     } else {
    //         this.addChild(card);
    //         this.destination = card;
    //         card.position.set(0 + card.width / 2, 0);

    //     }
    //     this.childrenCount++;
    // }
}