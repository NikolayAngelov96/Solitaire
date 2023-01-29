import { Container, Graphics, Text } from "pixi.js";
import { Column } from "./Column";
import { Foundation } from "./Foundation";
import { GameManager } from "./GameManager";
import { Suites } from './Constants';
import { Deck } from "./Deck";
import { CardFactory } from "./CardFactory";

export class Board extends Container {
    private cardColor: number = 0x196119;
    private spaceBetweenCards: number = 20;
    columns: Column[];

    constructor(
        private cardWidth: number,
        private cardHeight: number,
        private gameManager: GameManager,
        private cardFactory: CardFactory
    ) {
        super();

        this.columns = [];

        this.addDeckArea();
        this.addFoundationPile();
        this.addCardColumns();
        this.addGameTitle();
    }

    private addDeckArea() {
        const deck = new Deck(this.cardWidth, this.cardHeight, this.gameManager, this.cardFactory);
        // const deck = new Graphics();
        // deck.beginFill(this.cardColor);
        // deck.drawRoundedRect(10, 50, this.cardWidth, this.cardHeight, 12);
        // deck.endFill();

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
        this.addChild(deck, flippedPile);
    }

    private addFoundationPile() {
        let suitesArr = [...Object.values(Suites)];
        for (let i = 0; i < suitesArr.length; i++) {
            const currentFoundation = new Foundation(this.cardWidth, this.cardHeight, suitesArr[i], this.gameManager);
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
}