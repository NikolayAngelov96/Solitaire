import { Container, Graphics, Text } from "pixi.js";
import { cardSize, colors } from "../Constants";
import { Board } from "./Board";
import { Card } from "./Card";
import gsap from 'gsap';

export class Deck extends Container {
    private _area = new Graphics();

    constructor(private board: Board) {
        super();

        this.createArea(cardSize.w, cardSize.h);
        this.addText();
        this.position.set(10 + cardSize.w / 2, 50);
        this.interactive = true;
        this.fill();

        this.on('pointertapcapture', () => this.flipCard());
    }

    get destination() {
        return this;
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
        this._area.beginFill(colors.cardPlaceholder);
        this._area.drawRoundedRect(0, 0, width, height, 12);
        this._area.endFill();
        this.pivot.x = width / 2;
        this.addChild(this._area);
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
                    setTimeout(() => target.goTo(this), 900 + i * 150);
                    return 0;
                }
            });
        }
    }
}