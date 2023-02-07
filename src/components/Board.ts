import { Container, Text } from "pixi.js";
import { Column } from "./Column";
import { Foundation } from "./Foundation";
import { GameManager } from "../GameManager";
import { cardSize, Suits } from '../Constants';
import { Deck } from "./Deck";
import { CardFactory } from "../CardFactory";
import { Card } from "./Card";
import { gsap } from 'gsap';
import { FlippedPile } from "./FlippedPile";
import { Button } from "./Button";

export class Board extends Container {
    private cardWidth = cardSize.w;
    private cardHeight = cardSize.h;
    private spaceBetweenCards: number = 20;
    public columns: Column[] = [];
    public deck: Deck;
    public flippedPile: FlippedPile;
    public foundations: Foundation[] = [];

    constructor(
        public gameManager: GameManager,
        public cardFactory: CardFactory
    ) {
        super();

        this.addButtons();
        this.addCardColumns();
        this.addDeckArea();
        this.addFoundationPile();
        this.addGameTitle();

        this.gameManager.app.stage.addChild(this);
        window['board'] = this;
    }

    private addDeckArea() {
        this.deck = new Deck(this);
        this.flippedPile = new FlippedPile(this);

        this.addChild(this.deck, this.flippedPile);
    }

    private addFoundationPile() {
        for (let i = 0; i < [...Object.values(Suits)].length; i++) {
            const currentFoundation = new Foundation(this.cardWidth, this.cardHeight, this.gameManager);
            currentFoundation.position.set((this.cardWidth * 4 + i * this.spaceBetweenCards) + (i * this.cardWidth), 50);
            this.foundations.push(currentFoundation);
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
                this.dealColumns();
            });


        this.addChild(shuffleContainer);

    }

    private addButtons() {
        const cardsDesignBtn = new Button('Cards Design', 367, 22, 120, 25, 0x17a2b8);
        cardsDesignBtn.attachEventListener('pointerdown', this.gameManager.designPicker.bind(this.gameManager));

        const hintBtn = new Button('Hint', 250, 22, 85, 25, 0x17a2b8);
        hintBtn.attachEventListener('pointerdown', () => alert('This is very usefull hint'));

        const disconnectBtn = new Button('Disconnect', 150, 22, 85, 25, 0x28a745);
        disconnectBtn.attachEventListener('pointerdown', () => this.gameManager.restart());

        this.addChild(disconnectBtn, hintBtn, cardsDesignBtn);
    }

    public addPlayerNickname(nickname: string) {
        const text = new Text(`Hello, ${nickname}`, {
            fontFamily: 'Arial',
            fontSize: 18,
            fontStyle: 'italic',
            fill: 0xffffff,
            align: 'left',
        });
        text.anchor.set(0, 0.5);
        text.position.set(this.gameManager.app.screen.width - text.width - 55, 22);

        gsap.from(text, { pixi: { scale: 0 }, ease: 'back' });
        this.addChild(text);
    }

    private dealColumns(row = 0, col = 0, maxRows = 0) {
        const columns = this.gameManager.state.piles;

        // Initially set max rows to go for (possibly coming form a saved state)
        if (row == 0 && col == 0) {
            columns.forEach(pile => {
                if (pile.cards.length > maxRows) {
                    maxRows = pile.cards.length;
                }
            });
        }

        // If the current column is outside our total columns, proceed dealing next row of cards
        if (col == this.columns.length) {
            row++;
            col = 0;
        }

        if (row < maxRows && columns[col].cards[row]) {

            // Set front and Deal the last card from deck
            const { face, suit, faceUp } = columns[col].cards[row];
            const currentCard = this.deck.children.at(-1) as Card;
            currentCard.setFront(face, suit);
            currentCard.goTo(this.columns[col], faceUp, () => this.dealColumns(row, col + 1, maxRows));

        } else if (row < maxRows && columns[col].cards[row] == undefined) {
            // If there is no card proceed to next column
            this.dealColumns(row, col + 1, maxRows);
        } else {
            // Move to dealing to foundation
            this.dealFoundation();
        }
    }

    private dealFoundation(row = 0, col = 0, maxCards = 0) {
        const foundations = Object.values(this.gameManager.state.foundations) as any[];

        // Initially set max cards to go for (coming form a saved state)
        if (row == 0 && col == 0) {
            foundations.forEach((foundation) => {
                if (foundation.cards.length > maxCards) {
                    maxCards = foundation.cards.length;
                }
            });
        }

        // If the current column is outside our total foundations, proceed dealing next row of cards
        if (col == this.foundations.length) {
            row++;
            col = 0;
        }

        if (row < maxCards && foundations[col].cards[row]) {

            // Set front and Deal the last card from deck
            const { face, suit, faceUp } = foundations[col].cards[row];
            const currentCard = this.deck.children.at(-1) as Card;
            currentCard.setFront(face, suit);
            currentCard.goTo(this.foundations[col], faceUp, () => this.dealFoundation(row, col + 1, maxCards));

        } else if (row < maxCards && foundations[col].cards[row] == undefined) {
            // If there is no card proceed to next column
            this.dealFoundation(row, col + 1, maxCards);
        } else {
            // TODO: Move to dealing to waste pile
            this.dealWaste();
        }
    }

    private dealWaste(i = 0) {
        const wasteCards = this.gameManager.state.waste.cards;

        if (wasteCards[i]) {
            const { face, suit, faceUp } = wasteCards[i];
            const currentCard = this.deck.children.at(-1) as Card;
            currentCard.setFront(face, suit);
            currentCard.goTo(this.flippedPile, faceUp, () => this.dealWaste(i + 1));
        } else {
            this.setDeckCards();
        }
    }

    private setDeckCards() {
        const stateCards = this.gameManager.state.stock.cards;

        for (let i = 0; i < stateCards.length; i++) {
            const { face, suit } = stateCards[i];
            this.deck.cards[i].setFront(face, suit);
        }

        this.gameManager.cardsDealed = true;
    }

    // public dealFoundation() {
    //     const foundationState = this.gameManager.state.foundations;

    //     for (const {suit, cards} of Object.values(foundationState) as any) {


    //         const state = foundationState[key as keyof typeof foundationState];
    //         let currStateSuit = state.suit.slice(0, 1).toUpperCase();

    //         let foundation = this.foundations.find(x => x.suit == currStateSuit);
    //         if (foundation) {
    //             foundation.setCardsFromState(state.cards);
    //         }

    //     }
    // }
}