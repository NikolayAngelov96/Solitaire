import { Card } from "./components/Card";
import * as PIXI from 'pixi.js';
import { DesignPicker } from "./components/DesignPicker";
import { ConnectionDialogue } from "./components/ConnectionDialogue";
import { Assets, CardFactory } from "./CardFactory";
import { Board } from "./components/Board";
import { Connection } from "./Connection";
import { EndScreen } from './components/EndScreen';
import { GameState, Moves } from "./Constants";
import { Column } from "./components/Column";
import { Foundation } from "./components/Foundation";
import { FlippedPile } from "./components/FlippedPile";
import { Deck } from "./components/Deck";
import { CardArea } from "./components/CardArea";


export class GameManager {
    public cardFactory: CardFactory;
    public board: Board;
    private _draggingCard: Card = null;
    public cards: Card[] = [];
    public cardsDealed = false;
    public dealLayer = new PIXI.Container();
    public connection: Connection;
    private endScreen: EndScreen;
    public state: GameState;
    public moves: Moves;
    public movesCache: Moves | {} = {};
    public toFlip: Card;

    constructor(
        public app: PIXI.Application,
        public assets: Assets
    ) {
        this.cardFactory = new CardFactory(this);

        // Background to track mouse movement
        const background = new PIXI.Graphics();
        background.beginFill(0x005000);
        background.drawRect(0, 0, this.app.view.width, this.app.view.height);
        background.endFill();
        background.interactive = true;

        this.app.stage.addChild(background);
        this.board = new Board(this, this.cardFactory);
        this.app.stage.addChild(this.dealLayer);

        background.on('pointerup', () => {
            if (this.draggingCard && this.draggingCard.inMotion == false) {
                this.draggingCard.goBack();
            }
        });

        this.connectionDialogue();
    }

    set draggingCard(card: Card) {
        this._draggingCard = card;

        if (card) {
            this.sendTakeEvent();
            this.app.stage.addChild(card);
        }
    }

    get draggingCard() {
        return this._draggingCard;
    }

    set cardsLogo(texture: PIXI.Texture) {
        this.cards.forEach((card: Card) => {
            card.backLogo = texture;
        });
    }

    public designPicker() {
        new DesignPicker(this.app, this, this.cardFactory);
    }

    public connectionDialogue(): void {
        new ConnectionDialogue(this.app, this, this.board.shuffleAndDealCards.bind(this.board));
    }

    public async connect(nickname: string, dialogue: ConnectionDialogue) {
        // if (nickname == '') {
        //     throw new Error('Nickname is required.');
        // }

        this.connection = new Connection(nickname);
        this.setConnectionListeners();
        await this.connection.open();
        this.connection.send('startGame');
        this.board.addPlayerNickname(nickname);
        dialogue.destroy({ children: true });
    }

    public restart() {
        this.connection.disconnect();
        this.cards.forEach(card => card.destroy());
        this.cardsDealed = false;
        this.cards.length = 0;
        this.board.deck.fill();
        this.connectionDialogue();
    }

    public endGame(hasWon: boolean) {
        this.endScreen = new EndScreen(this.app, this.cardFactory, this.board);

        if (hasWon) {
            this.endScreen.animateWin();
        } else {
            this.endScreen.animateLoosing();
        }
    }

    private setConnectionListeners() {
        this.connection.on('state', this.onState.bind(this));
        this.connection.on('moves', this.onMoves.bind(this));
        this.connection.on('moveResult', this.onResult.bind(this));
        this.connection.on('victory', this.onVictory.bind(this));
    }

    private onState(state) {
        console.log('received state', state);
        this.state = state;
        this.board.deck.fill();
    }

    private onMoves(receivedMoves) {
        console.log('received moves: ', receivedMoves);
        this.moves = receivedMoves;

        // Check for card to flip on columns
        for (let i = 0; i < this.moves.piles.length; i++) {
            if (this.moves.piles[i].flip) {
                this.toFlip = this.board.columns[i].destination;
                this.connection.send('move', { action: 'flip', source: `pile${i}` });
            }
        }
    }

    private onResult(data) {
        console.log(data);

        if (this.toFlip && data) {
            const card = this.toFlip;
            card.setFront(data.face, data.suit);

            if (data.faceUp) {
                if (card.slot instanceof Deck) {
                    this.board.deck.flipCard();
                } else {
                    card.flip();
                }
            }

            this.toFlip = undefined;

        } else if (data == null && this.board.deck.cards.length == 0 && this.board.flippedPile.cards.length > 0) {
            this.board.deck.returnCards();
        }
    }

    private onVictory() {
        this.endGame(true);
    }

    public checkValidTake(card: Card) {
        let validTakes = [];

        if (card.slot instanceof Column) {
            validTakes = this.moves.piles[card.slot.id].take;
        } else if (card.slot instanceof Foundation) {
            validTakes = this.moves.foundations[card.slot.suit].take;
        } else if (card.slot instanceof FlippedPile) {
            validTakes = this.moves.waste.take;
        } else if (card.slot instanceof Deck) {
            validTakes = this.moves.stock.take;
        }

        return validTakes.includes(card.index);
    }

    public sendTakeEvent() {
        if (this.draggingCard) {
            const card = this.draggingCard;
            let source = '';

            if (card.slot instanceof Column) {
                source = `pile${card.slot.id}`;
            } else if (card.slot instanceof Foundation) {
                source = card.slot.suit;
            } else if (card.slot instanceof FlippedPile) {
                source = 'stock';
            }

            // Cache the valid moves in case we return the card back
            Object.assign(this.movesCache, this.moves);

            this.connection.send('move', {
                action: 'take',
                source: source,
                target: null,
                index: card.index
            });
        }
    }

    public checkValidPlace(slot: CardArea) {
        if (slot instanceof Column) {
            return this.moves.piles[slot.id].place;
        } else if (slot instanceof Foundation) {
            return this.moves.foundations[slot.suit].place;
        }
    }

    public sendPlaceEvent(newSlot: CardArea = null) {
        const index = this.draggingCard.sourceIndex;
        let sourceSlot = this.draggingCard.slot;
        let source = '';
        let target = '';

        if (sourceSlot instanceof Column) {
            source = `pile${sourceSlot.id}`;
        } else if (sourceSlot instanceof Foundation) {
            source = sourceSlot.suit;
        } else if (sourceSlot instanceof FlippedPile) {
            source = `stock`;
        }

        if (newSlot instanceof Column) {
            target = `pile${newSlot.id}`;
        } else if (newSlot instanceof Foundation) {
            target = newSlot.suit;
        }

        this.connection.send('move', {
            action: 'place',
            source: source,
            target: target,
            index: index
        });
    }

    public sendFlipStockEvent() {
        this.connection.send('move', { action: 'flip', source: 'stock' });
    }
}