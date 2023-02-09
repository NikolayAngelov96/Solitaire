import { FlipArea } from "./FlipArea";
import { Board } from "./Board";
import { Text } from "pixi.js";
import { CARD_SIZE } from "../Constants";
import { Card } from "./Card";
import gsap from 'gsap';

export class Deck extends FlipArea {
    public returning = false;

    constructor(private board: Board) {
        super(board);

        this.addText();
        this.position.set(10 + CARD_SIZE.w / 2, 50);

        this.on('pointertapcapture', () => {
            if (this.board.gameManager.cardsDealed && this.board.gameManager.moves.stock.flip && this.returning == false) {

                if (this.cards.length > 0) {
                    this.board.gameManager.toFlip = this.cards.at(-1);
                }

                this.board.gameManager.connection.send('move', { action: 'flip', source: 'stock' });
            }
        });
    }

    public fill() {
        const state = this.board.gameManager.state;
        let totalCards = 0;

        totalCards += state.stock.cards.length + state.waste.cards.length;
        Object.values(state.foundations).forEach(f => totalCards += f.cards.length);
        state.piles.forEach(p => totalCards += p.cards.length);

        for (let i = 0; i < totalCards; i++) {
            const card = this.board.cardFactory.getCard();
            card.x = card.width / 2;
            this.addChild(card);
            card.slot = this;
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
        const lastCard = this.cards.at(-1);

        if (this.board.gameManager.cardsDealed && lastCard) {
            lastCard.goTo(this.board.flippedPile);
        }
    }

    public returnCards() {
        const wasteCards = this.board.flippedPile.cards;

        if (this.board.gameManager.cardsDealed && wasteCards.length > 0 && wasteCards.at(-1).faceUp) {
            this.returning = true;
            wasteCards.reverse();

            gsap.to(wasteCards, {
                pixi: {
                    y: -50,
                },
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                stagger: (i, target: Card) => {
                    target.flip();
                    target.interactive = false; // Prevents from clicking on cards during returning animation

                    if (i == wasteCards.length - 1) { // If last card, switch returning flag
                        setTimeout(() => target.goTo(this, false, () => this.returning = false), 900 + i * 150);
                    } else {
                        setTimeout(() => target.goTo(this), 900 + i * 150);
                    }

                    return 0;
                }
            });
        }
    }
}