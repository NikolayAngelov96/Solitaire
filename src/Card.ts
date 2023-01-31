import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { cardSize, colors, Ranks, Suites } from './Constants';
import { GameManager } from './GameManager';
import { Column } from './Column';
import { Foundation } from './Foundation';
import { Deck } from './Deck';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export type CardFrontsTextures = { [key: string]: PIXI.Texture; };
window['cards'] = [];
export class Card extends PIXI.Container {
    private front = new PIXI.Container();
    private _back = new PIXI.Container();
    private _backLogoSprite: PIXI.Sprite;
    public suite: Suites;
    public rank: Ranks;
    public power: number;
    private oldGlobalPosition: PIXI.Point;
    private pointerOffsetFromCardPivot = new PIXI.Point(0, 0);
    private flipTween: gsap.core.Tween;
    public slot: Column | Foundation | Deck;

    constructor(
        private cardFrontsTextures: CardFrontsTextures,
        logoTexture: PIXI.Texture,
        private gameManager: GameManager) {
        super();

        // Initiate the card with the back up and unknown front (empty front container)
        this.setBack(logoTexture);

        this.front.renderable = false;
        this.addChild(this.front);

        this.addBorder();
        this.addMask();
        this.makeFlippable();
        this.makeDraggable();

        this.pivot.x = this.width / 2;
        // this.scale.set(0.334);
        this.interactive = true;

        // For testing
        window['cards'].push(this);
        // this.on('pointerupcapture', () => { console.log('Cap'); });
    }

    get back() {
        return this._back;
    }

    public setBack(logoTexture: PIXI.Texture) {
        this._back.removeChildren();
        const backBackground = new PIXI.Graphics();
        backBackground.beginFill(colors.darkBg, 1);
        backBackground.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 16);
        backBackground.endFill();

        const backLogo = PIXI.Sprite.from(logoTexture);
        backLogo.anchor.set(0.5);
        backLogo.position.set(backBackground.width / 2, backBackground.height / 2);
        this._backLogoSprite = backLogo;
        this.setBackLogo = logoTexture;
        // backLogo.scale.set((cardSize.w - 15) / logoTexture.width);

        this._back.addChild(backBackground, backLogo);
        this.addChild(this._back);
    }

    set setBackLogo(texture: PIXI.Texture) {
        this._backLogoSprite.texture = texture;
        this._backLogoSprite.scale.set((cardSize.w - 20) / texture.width);
    }

    public setFront(cardId: string) {
        if (this.front.children.length == 0) {
            const sprite = PIXI.Sprite.from(this.cardFrontsTextures[cardId]);
            sprite.scale.set(0.334);
            this.front.addChild(sprite);

            let suite = this.getSuiteFromId(cardId);
            this.suite = suite;
        } else {
            throw new Error('This card already has a front.');
        }
    }

    private addBorder() {
        const border = new PIXI.Graphics();
        border.lineStyle(4, colors.border);
        border.beginFill(0x000000, 0);
        border.drawRoundedRect(2, 2, cardSize.w - 4, cardSize.h - 4, 12);
        border.endFill();
        this.addChild(border);
    }

    private addMask() {
        const mask = new PIXI.Graphics();
        mask.lineStyle(1, 0x999999);
        mask.beginFill(0x000000, 1);
        mask.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 16);
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
            paused: true
        });

        // Remove later
        // this.on('pointertap', () => {
        //     this.flip();
        // });

    }

    private makeDraggable() {
        this.on('pointerdown', (e) => {

            // Save pivot offset from click position
            this.oldGlobalPosition = (e.target as PIXI.Container).getGlobalPosition();
            this.pointerOffsetFromCardPivot.x = e.globalX - this.oldGlobalPosition.x;
            this.pointerOffsetFromCardPivot.y = e.globalY - this.oldGlobalPosition.y;

            // Move card fom pile to stage and set global position
            this.x = e.globalX - this.pointerOffsetFromCardPivot.x;
            this.y = e.globalY - this.pointerOffsetFromCardPivot.y;

            this.interactive = false;
            this.gameManager.setDraggingCard(this);
            e.stopPropagation();

            this.on('globalmousemove', this.move);
        });

        this.on('pointerup', () => {
            this.gameManager.draggingCard = null;
            this.interactive = true;
            this.off('globalmousemove');
        });
    }

    public move(e: PIXI.FederatedPointerEvent) {
        this.x = e.globalX - this.pointerOffsetFromCardPivot.x;
        this.y = e.globalY - this.pointerOffsetFromCardPivot.y;
    }

    public flip() {
        if (!this.flipTween.isActive()) {
            // console.log('Flipping');
            this.flipTween.restart();
        }
    }

    public goTo(slot: Column | Foundation | Deck) {
        // All logic here
        const destinationPosition = slot.destinationGlobalPosition;

        gsap.to(this, {
            pixi: {
                x: destinationPosition.x,
                y: destinationPosition.y,
            },
            duration: 0.2,
            onComplete: () => {
                slot.addCard(this);
            }
        });
    }

    public goBack() {

        gsap.to(this, {
            pixi: {
                x: this.oldGlobalPosition.x,
                y: this.oldGlobalPosition.y,
            },
            ease: 'back',
            onComplete: () => this.slot.addCard(this)
        });
        this.disableEventListener();
    }

    public disableEventListener() {
        this.interactive = true;
        this.off('globalmousemove');
    }

    private getSuiteFromId(cardId: string): Suites {
        let letter = cardId.slice(cardId.length - 1);
        switch (letter) {
            case 'S':
                return Suites.Spades;
            case 'D':
                return Suites.Diamonds;
            case 'H':
                return Suites.Hearts;
            case 'C':
                return Suites.Clubs;
            default:
                throw new TypeError('Not a valid suite type');
        }
    }

    public goGlobal() {
        // Save pivot offset from click position
        const globalPosition = this.getGlobalPosition();
        this.x = globalPosition.x;
        this.y = globalPosition.y;
        this.gameManager.app.stage.addChild(this);
        // this.interactive = false;
    }
}