import { Container, Graphics } from "pixi.js";
import { CardFactory } from "../CardFactory";
import { colors } from "../Constants";
import { GameManager } from "../GameManager";

export class Deck extends Container {

    constructor(width: number, height: number, private gameManager: GameManager, private cardFactory: CardFactory) {
        super();
        this.createArea(width, height);
        this.position.set(10 + width / 2, 50);
        this.interactive = true;
        this.fill();

        this.on('pointertapcapture', (e) => {
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

    private createArea(width: number, height: number) {
        const area = new Graphics();
        area.beginFill(colors.cardPlaceholder);
        area.drawRoundedRect(0, 0, width, height, 12);
        area.endFill();
        this.pivot.x = width / 2;
        this.addChild(area);
    }
}