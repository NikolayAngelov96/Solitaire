import { Container, Graphics } from "pixi.js";
import { cardSize, colors } from "../Constants";
import { Board } from "./Board";
import { Card } from "./Card";

export class Deck extends Container {

    constructor(private board: Board) {
        super();

        this.createArea(cardSize.w, cardSize.h);
        this.position.set(10 + cardSize.w / 2, 50);
        this.interactive = true;
        this.fill();

        this.on('pointertapcapture', () => {
            const lastChild = this.children.at(-1);

            if (this.board.gameManager.cardsDealed && lastChild instanceof Card) {
                lastChild.setRandomFront();
                lastChild.goTo(this.board.flippedPile);
            }
        });
    }

    get destinationGlobalPosition() {
        return this.getGlobalPosition();
    }

    private fill() {
        for (let i = 0; i < 52; i++) {
            const card = this.board.cardFactory.getCard();
            card.x = card.width / 2;
            this.addChild(card);
            this.board.gameManager.cards.push(card);
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