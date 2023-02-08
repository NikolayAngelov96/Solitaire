import { Card } from "./components/Card";
import * as PIXI from 'pixi.js';
import { DesignPicker } from "./components/DesignPicker";
import { ConnectionDialogue } from "./components/ConnectionDialogue";
import { Assets, CardFactory } from "./CardFactory";
import { Board } from "./components/Board";
import { Connection } from "./Connection";
import { EndScreen } from './components/EndScreen';
import { Suits, EntityState, GameState, Moves } from "./Constants";


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

        background.on('pointerup', () => this.draggingCard?.goBack());
        this.connectionDialogue();
    }

    set draggingCard(card: Card) {
        this._draggingCard = card;

        if (card) {
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
        // this.connection.on('state', this.onState.bind(this));
        this.setConnectionListeners();
        await this.connection.open();
        this.connection.send('startGame');
        this.board.addPlayerNickname(nickname);
        dialogue.destroy({ children: true });
        this.board.deck.attachListenerForDeckFlip();
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
        // this.state.foundations = foundations; // Mock data
        // this.state.waste = waste; // Mock data
        this.board.deck.fill();
    }

    private onMoves(receivedMoves) {
        console.log('received moves: ', receivedMoves);
        this.moves = receivedMoves;
    }

    private onResult(data) {
        console.log('onResult: ', data);
    }

    private onVictory() {
        this.endGame(true);
    }
}

const waste: EntityState = {
    cards: [{
        face: 2,
        suit: 'clubs',
        faceUp: true
    },
    {
        face: 7,
        suit: 'clubs',
        faceUp: true
    }
    ],
    type: "waste",
    suit: null
};

const foundations: { [key in keyof typeof Suits]: EntityState } = {
    clubs: {
        cards: [
            {
                face: 2,
                suit: 'clubs',
                faceUp: true
            },
            {
                face: 7,
                suit: 'clubs',
                faceUp: true
            }
        ],
        type: 'foundation',
        suit: 'clubs'
    },
    diamonds: {
        cards: [{
            face: 1,
            suit: 'diamonds',
            faceUp: true
        },
        {
            face: 5,
            suit: 'diamonds',
            faceUp: true
        }],
        type: "foundation",
        suit: "diamonds"
    },
    hearts: {
        cards: [
            // {
            //     face: 1,
            //     suit: 'hearts',
            //     faceUp: true
            // }
        ],
        type: "foundation",
        suit: "hearts"
    },
    spades: {
        cards: [
            {
                face: 3,
                suit: 'spades',
                faceUp: true
            },
            {
                face: 4,
                suit: 'spades',
                faceUp: true
            }
        ],
        type: "foundation",
        suit: "spades"
    }
};
