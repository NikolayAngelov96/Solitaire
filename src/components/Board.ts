import { Container, Graphics, Text } from "pixi.js";
import { Column } from "./Column";
import { Foundation } from "./Foundation";
import { GameManager } from "../GameManager";
import { cardSize, Ranks, Suites } from '../Constants';
import { Deck } from "./Deck";
import { CardFactory } from "../CardFactory";
import { Card } from "./Card";
import { gsap } from 'gsap';

export class Board extends Container {
    private cardWidth = cardSize.w;
    private cardHeight = cardSize.h;
    private cardColor: number = 0x196119;
    private spaceBetweenCards: number = 20;
    columns: Column[];
    public deck: Deck;

    constructor(
        private gameManager: GameManager,
        private cardFactory: CardFactory
    ) {
        super();

        this.columns = [];

        this.addCardColumns();
        this.addDeckArea();
        this.addFoundationPile();
        this.addGameTitle();
    }

    private addDeckArea() {
        this.deck = new Deck(this.cardWidth, this.cardHeight, this.gameManager, this.cardFactory);

        const flippedPile = new Graphics();
        flippedPile.beginFill(this.cardColor);
        flippedPile.drawRoundedRect(0, 0, this.cardWidth, this.cardHeight, 12);
        flippedPile.position.set(this.cardWidth + this.spaceBetweenCards + 10, 50);
        flippedPile.endFill();

        const text = new Text("Press SPACE \n To Flip", {
            fontFamily: "Arial",
            fontSize: 16,
            align: "center"
        });


        text.anchor.set(0.5);
        text.position.set(flippedPile.width / 2, flippedPile.height / 2);

        flippedPile.addChild(text);
        this.addChild(this.deck, flippedPile);
    }

    private addFoundationPile() {
        for (let i = 0; i < [...Object.values(Suites)].length; i++) {
            const currentFoundation = new Foundation(this.cardWidth, this.cardHeight, this.gameManager);
            currentFoundation.position.set((this.cardWidth * 4 + i * this.spaceBetweenCards) + (i * this.cardWidth), 50);

            this.addChild(currentFoundation);
        }
    }

    private addCardColumns() {
        for (let i = 0; i < 7; i++) {
            const currentCol = new Column(this.cardWidth, this.cardHeight, this.gameManager);
            currentCol.position.set((this.cardWidth / 2) + 10 + (i * this.spaceBetweenCards) + (i * this.cardWidth), this.cardHeight + this.spaceBetweenCards + 50);

            this.columns.push(currentCol);
            this.addChild(currentCol);
        }
    }

    private addGameTitle() {
        const title = new Text('Solitaire', {
            fill: 'white',
            fontSize: 20,
            dropShadow: true
        });

        title.position.set(10, 10);
        this.addChild(title);
    }

    public dealCards(startCol = 0, col = 0) {

        if (startCol < this.columns.length) {

            const currentCard = this.deck.children.at(-1) as Card;
            currentCard.goTo(this.columns[col], true);
            currentCard.makeDraggable();

            // Random front
            const cardId = Object.values(Ranks)[Math.random() * 13 | 0] + Object.values(Suites)[Math.random() * 4 | 0];
            currentCard.setFront(cardId);

            setTimeout(() => {
                if (col == startCol) {
                    currentCard.flip();
                }

                col++;

                if (col == this.columns.length) {
                    startCol++;
                    col = startCol;
                }

                this.dealCards(startCol, col);
            }, 300);
        } else if (startCol >= this.columns.length) {
            this.gameManager.cardsDealed = true;
        }
    }

    public shuffleAndDealCards() {
        let shuffleContainer = new Container();

        for (let i = 0; i < 5; i++) {
            let card = this.cardFactory.getCard();
            card.pivot.set(card.width, 0);
            card.position.set(this.deck.x + this.deck.width / 2, this.deck.y);
            shuffleContainer.addChild(card);
        }

        gsap.to(shuffleContainer, {
            pixi: { x: this.width / 2 - shuffleContainer.width / 2, y: this.height / 2 }, onStart: () => this.deck.renderable = false
        });
        const initialSkewAnim = gsap.timeline({ defaults: { ease: 'power2' } });

        let card5 = shuffleContainer.children[4];
        let card4 = shuffleContainer.children[3];
        let card3 = shuffleContainer.children[2];
        let card2 = shuffleContainer.children[1];
        let card = shuffleContainer.children[0];

        let startSkew = 15;
        initialSkewAnim.to(card5, { pixi: { skewX: startSkew, skewY: 15 } })
            .to(card4, { pixi: { skewX: startSkew - 3, skewY: 15 } }, '<')
            .to(card3, { pixi: { skewX: startSkew - 6, skewY: 15 } }, '<')
            .to(card2, { pixi: { skewX: startSkew - 9, skewY: 15 } }, '<')
            .to(card, { pixi: { skewX: startSkew - 12, skewY: 15 } }, '<');


        // to make the zIndex work the container.sortableChildren should be set to true;
        shuffleContainer.sortableChildren = true;
        // so topmost card is always on top
        card5.zIndex = 3;
        card4.zIndex = 1;
        card3.zIndex = 1;

        const shuffleAnim = gsap.timeline({ defaults: { duration: 0.1, ease: 'sine' } });

        let children = shuffleContainer.children.slice(0, 2);
        shuffleAnim.to(children[0], { pixi: { x: '-=125', skewX: -5 } })
            .to(children[1], { pixi: { x: '-= 122' } }, '<')
            .to(children, { pixi: { y: '-= 50', zIndex: 2 } })
            .to(children, { pixi: { x: '+= 125' } })
            .to(children[0], { pixi: { skewX: 16, skewY: 15, y: '+= 47' } }, '<')
            .to(children[1], { pixi: { skewX: 13, y: '+= 50' } }, '<');


        shuffleAnim.repeat(4);
        shuffleAnim.repeatDelay(0.2);

        let master = gsap.timeline();
        master.add(initialSkewAnim)
            .add(shuffleAnim)
            .to(shuffleContainer, {
                pixi: { x: this.deck.x - this.deck.width / 2, y: this.deck.y - 50 },
                ease: 'sine'
            })
            .add(() => {
                initialSkewAnim.reverse();
                initialSkewAnim.play();
            })
            .call(() => {
                this.deck.renderable = true;
                shuffleContainer.destroy();
                this.dealCards();
            });


        this.addChild(shuffleContainer);

    }
}