import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { CARD_SIZE, COLORS, RANKS, Suits } from '../Constants';
import { GameManager } from '../GameManager';
import { Column } from './Column';
import { Foundation } from './Foundation';
import { FlippedPile } from './FlippedPile';
import { Deck } from './Deck';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export type Slot = Column | Foundation | FlippedPile | Deck;

export type CardFrontsTextures = { [key: string]: PIXI.Texture; };
window['cards'] = [];
export class Card extends PIXI.Container {
    private front = new PIXI.Container();
    private _back = new PIXI.Container();
    private _backLogoSprite: PIXI.Sprite;
    private _faceUp = false;
    public suit: Suits;
    public power: number;
    private oldGlobalPosition: PIXI.Point;
    private pointerOffsetFromCardPivot = new PIXI.Point(0, 0);
    private flipTween: gsap.core.Tween;
    public _slot: Slot;
    public sourceIndex: number;
    public inMotion = false;

    constructor(
        private cardFrontsTextures: CardFrontsTextures,
        logoTexture: PIXI.Texture,
        private gameManager: GameManager
    ) {
        super();

        // Initiate the card with the back up and unknown front (empty front container)
        this.setBack(logoTexture);
        this.front.renderable = false;
        this.addChild(this.front);

        this.addBorder();
        this.addMask();
        this.interactive = true;
        this.makeFlippable();
        this.makeDraggable();

        this.pivot.x = this.width / 2;
    }

    get faceUp() {
        return this._faceUp;
    }

    get color() {
        // 0 = Black, 1 = Red :)
        if (this.suit) {
            return Number(this.suit == Suits.hearts || this.suit == Suits.diamonds);
        }
    }

    get slot() {
        return this._slot;
    }

    set slot(newSlot: Slot) {
        this._slot = newSlot;

        const lastChild = this.children.at(-1);
        if (lastChild instanceof Card) {
            lastChild.slot = newSlot;
        }
    }

    get index(): number {
        return this.getIndex();
    }

    private getIndex(i = 0, parent = this.parent as Slot | Card) {
        if (parent instanceof Column || parent instanceof Foundation) {
            return i;
        }

        if (parent instanceof Deck || parent instanceof FlippedPile) {
            return parent.children.filter(e => e instanceof Card).findIndex(e => e === this);
        }

        if (parent instanceof Card) {
            return this.getIndex(i + 1, parent.parent as Card | Column | Foundation);
        }
    }

    private setBack(logoTexture: PIXI.Texture) {
        const backBackground = new PIXI.Graphics();
        backBackground.beginFill(COLORS.darkBg, 1);
        backBackground.drawRoundedRect(0, 0, CARD_SIZE.w, CARD_SIZE.h, 16);
        backBackground.endFill();

        this._backLogoSprite = PIXI.Sprite.from(logoTexture);
        this.backLogo = logoTexture; // Thru the setter
        this._backLogoSprite.anchor.set(0.5);
        this._backLogoSprite.position.set(backBackground.width / 2, backBackground.height / 2);

        this._back.addChild(backBackground, this._backLogoSprite);
        this.addChild(this._back);
    }

    set backLogo(texture: PIXI.Texture) {
        this._backLogoSprite.texture = texture;
        this._backLogoSprite.scale.set((CARD_SIZE.w - 20) / texture.width);
    }

    public setFront(power: number, suit: string) {
        this.front.removeChildren();

        this.power = power;
        this.suit = Suits[suit];

        const sprite = PIXI.Sprite.from(this.cardFrontsTextures[`${this.power}${this.suit}`]);
        sprite.scale.set(0.334);
        this.front.addChild(sprite);
    }

    private addBorder() {
        const border = new PIXI.Graphics();
        border.lineStyle(4, COLORS.border);
        border.beginFill(0x000000, 0);
        border.drawRoundedRect(2, 2, CARD_SIZE.w - 4, CARD_SIZE.h - 4, 12);
        border.endFill();
        this.addChild(border);
    }

    private addMask() {
        const mask = new PIXI.Graphics();
        mask.lineStyle(1, 0x999999);
        mask.beginFill(0x000000, 1);
        mask.drawRoundedRect(0, 0, CARD_SIZE.w, CARD_SIZE.h, 16);
        mask.endFill();
        this.front.mask = mask;
        this.addChild(mask);
    }

    private makeFlippable() {

        // Toggle front and back
        this.flipTween = gsap.to(this, {
            pixi: { scaleX: 0 },
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            onRepeat: () => {
                this.front.renderable = !this.front.renderable;
                this._back.renderable = !this._back.renderable;
            },
            onComplete: () => this._faceUp = !this._faceUp,
            paused: true
        });
    }

    public makeDraggable() {
        this.on('pointerdown', (e) => {
            if (this.gameManager.cardsDealed && this.gameManager.draggingCard == null && this.gameManager.checkValidTake(this)) {
                this.interactive = false;
                this.sourceIndex = this.index;

                // Save pivot offset from click position
                this.oldGlobalPosition = this.getGlobalPosition();
                this.pointerOffsetFromCardPivot.x = e.globalX - this.oldGlobalPosition.x;
                this.pointerOffsetFromCardPivot.y = e.globalY - this.oldGlobalPosition.y;

                // Move card fom pile to stage and set global position
                this.gameManager.draggingCard = this;
                this.x = e.globalX - this.pointerOffsetFromCardPivot.x;
                this.y = e.globalY - this.pointerOffsetFromCardPivot.y;
                this.on('globalmousemove', this.move);

                e.stopPropagation();
            }
        });
    }

    public move(e: PIXI.FederatedPointerEvent) {
        this.x = e.globalX - this.pointerOffsetFromCardPivot.x;
        this.y = e.globalY - this.pointerOffsetFromCardPivot.y;
    }

    public flip() {
        if (!this.flipTween.isActive()) {
            this.flipTween.restart();
        }
    }

    public goTo(newSlot: Slot, flip = false, onCompleteCallBack?: () => void) {
        this.inMotion = true;
        this.goTopLayer();
        const destinationPosition = newSlot.destinationGlobalPosition;

        gsap.to(this, {
            pixi: {
                x: destinationPosition.x,
                y: destinationPosition.y,
            },
            duration: 0.2,
            onComplete: () => {
                if (this.slot instanceof Column) {
                    this.slot.flipLastCard();
                }

                this.slot = newSlot;
                this.onComplete();

                if (flip) {
                    this.flip();
                }

                if (onCompleteCallBack) {
                    onCompleteCallBack();
                }
            }
        });
    }

    public goBack() {
        this.inMotion = true;
        this.goTopLayer();

        gsap.to(this, {
            pixi: {
                x: this.oldGlobalPosition.x,
                y: this.oldGlobalPosition.y,
            },
            ease: 'back',
            onComplete: () => {
                this.onComplete();
                Object.assign(this.gameManager.moves, this.gameManager.movesCache); // Restore initial valid moves
            }
        });
    }

    private onComplete() {
        this.gameManager.draggingCard = null;
        this.interactive = true;

        this.position.set(CARD_SIZE.w / 2, 0);

        if (this.slot instanceof Column && this.slot.cardsCount > 0) {
            this.position.set(CARD_SIZE.w / 2, 30);
        }

        if (this.slot instanceof FlippedPile && this.faceUp == false) {
            this.flip();
        }

        this.slot.destination.addChild(this);
        this.inMotion = false;
    }

    public goTopLayer() {
        // Move card to top layer
        this.off('globalmousemove'); // to remove
        const globalPosition = this.getGlobalPosition();
        this.x = globalPosition.x;
        this.y = globalPosition.y;
        this.gameManager.dealLayer.addChild(this);
    }
}