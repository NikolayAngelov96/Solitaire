import { FlipArea } from "./FlipArea";
import { Board } from "./Board";
import { Text } from "pixi.js";
import { CARD_SIZE } from "../Constants";
import { Card } from "./Card";
import gsap from 'gsap';

export class Deck extends FlipArea {

    constructor(private board: Board) {
        super(board);

        this.addText();
        this.position.set(10 + CARD_SIZE.w / 2, 50);
        // this.fill();

        // this.on('pointertapcapture', () => this.flipCard());

        this.on('pointertapcapture', () => {
            this.board.gameManager.connection.send('move', { action: 'flip', source: 'stock', target: null, index: 0 });
        });

        window['deck'] = this;
    }

    public attachListenerForDeckFlip() {
        this.board.gameManager.connection.on('moveResult', (data) => {
            // this.flipCard(data.face, data.suit);
            if (data) {
                let { face, suit, faceUp } = data;
                const deckLastChild = this.children.at(-1);
                const flippedLastChild = this.board.flippedPile.children.at(-1);
                if (this.board.gameManager.cardsDealed && deckLastChild instanceof Card) {
                    // deckLastChild.setRandomFront();
                    if (face && suit) {
                        deckLastChild.setFront(face, suit);
                    }
                    deckLastChild.goTo(this.board.flippedPile);
                }
            } else {
                // move all cards from waste to deck
                const flippedPileCards = this.board.flippedPile.children.slice(0) as Card[];
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
                        target.interactive = false; // Prevents from clicking on cards during returning animation

                        if (i < flippedPileCards.length) {
                            setTimeout(() => target.goTo(this), 900 + i * 150);
                        } else {
                            setTimeout(() => {
                                target.flip();
                                flippedPileCards.forEach(card => card.interactive = true);
                            }, 900 + i * 150);
                        }

                        return 0;
                    }
                });
            }
        })

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

    // public flipCard() {
    //     const deckLastChild = this.children.at(-1);
    //     const flippedLastChild = this.board.flippedPile.children.at(-1);

    //     // Flip card to flipped area
    //     if (this.board.gameManager.cardsDealed && deckLastChild instanceof Card) {

    //         deckLastChild.goTo(this.board.flippedPile);

    //         // Return cards to deck
    //     } else if (this.board.gameManager.cardsDealed && flippedLastChild instanceof Card && flippedLastChild.faceUp) {
    //         const flippedPileCards = this.board.flippedPile.children.slice(1) as Card[];
    //         flippedPileCards.reverse();

    //         gsap.to(flippedPileCards, {
    //             pixi: {
    //                 y: -50,
    //             },
    //             duration: 0.3,
    //             yoyo: true,
    //             repeat: 1,
    //             stagger: (i, target) => {
    //                 target.flip();
    //                 target.interactive = false; // Prevents from clicking on cards during returning animation

    //                 if (i < flippedPileCards.length - 1) {
    //                     setTimeout(() => target.goTo(this), 900 + i * 150);
    //                 } else {
    //                     setTimeout(() => {
    //                         target.flip();
    //                         flippedPileCards.forEach(card => card.interactive = true);
    //                     }, 900 + i * 150);
    //                 }

    //                 return 0;
    //             }
    //         });
    //     }
    // }
}