import { FlipArea } from "./FlipArea";
import { Board } from "./Board";
import { Text } from "pixi.js";
import { cardSize } from "../Constants";
import { Card } from "./Card";
import gsap from 'gsap';

export class Deck extends FlipArea {

    constructor(private board: Board) {
        super();

        this.addText();
        this.position.set(10 + cardSize.w / 2, 50);
        this.interactive = true;
        this.fill();

        this.on('pointertapcapture', () => this.flipCard());
    }

    private fill() {
        for (let i = 0; i < 52; i++) {
            const card = this.board.cardFactory.getCard();
            card.x = card.width / 2;
            this.addChild(card);
            this.board.gameManager.cards.push(card);
        }
    }

    private addText() {
        const text = new Text("Click to\nreturn cards", {
            fontFamily: "Arial",
            fontSize: 18,
            align: "center"
        });

        text.anchor.set(0.5);
        text.position.set(this._area.width / 2, this._area.height / 2);

        this._area.addChild(text);
    }

    public flipCard() {
        const deckLastChild = this.children.at(-1);
        const flippedLastChild = this.board.flippedPile.children.at(-1);

        // Flip card to flipped area
        if (this.board.gameManager.cardsDealed && deckLastChild instanceof Card) {
            deckLastChild.setRandomFront();
            deckLastChild.goTo(this.board.flippedPile);

            // Return cards to deck
        } else if (this.board.gameManager.cardsDealed && flippedLastChild instanceof Card && flippedLastChild.faceUp) {
            const flippedPileCards = this.board.flippedPile.children.slice(1) as Card[];
            flippedPileCards.reverse();

            gsap.to(flippedPileCards, {
                pixi: {
                    y: -50,
                },
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                stagger: (i, target) => {
                    target.flip();
                    if (i < flippedPileCards.length - 1) {
                        setTimeout(() => target.goTo(this), 900 + i * 150);
                    } else {
                        setTimeout(() => target.flip(), 900 + i * 150);
                    }
                    return 0;
                }
            });
        }
    }
}