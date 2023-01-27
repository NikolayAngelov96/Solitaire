import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { cardSize, Ranks, Suites } from './Constants';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card extends PIXI.Container {
    private front: PIXI.Sprite;
    private back = new PIXI.Container();
    public suite: Suites;
    public rank: Ranks;
    public power: number;

    constructor(cardsTexture: PIXI.Texture, x: number, y: number, logoTexture: PIXI.Texture) {
        super();

        // Border
        const border = new PIXI.Graphics();
        border.lineStyle(10, 0xa6ce39);
        border.beginFill(0x000000, 0);
        border.drawRoundedRect(5, 5, cardSize.w - 10, cardSize.h - 10, 28);
        border.endFill();

        // Mask
        const mask = new PIXI.Graphics();
        mask.lineStyle(1, 0x999999);
        mask.beginFill(0x000000, 1);
        mask.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 36);
        mask.endFill();
        this.mask = mask;

        // Back
        const backBackground = new PIXI.Graphics();
        backBackground.beginFill(0x07162B, 1);
        backBackground.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 36);
        backBackground.endFill();

        const backLogo = PIXI.Sprite.from(logoTexture);
        backLogo.anchor.set(0.5);
        backLogo.position.set(backBackground.width / 2, backBackground.height / 2);
        backLogo.scale.set(2.2);

        this.back.addChild(backBackground, backLogo);
        this.back.renderable = false;

        // Front
        const frontTexture = new PIXI.Texture(cardsTexture.baseTexture, new PIXI.Rectangle(x, y, cardSize.w, cardSize.h));
        this.front = PIXI.Sprite.from(frontTexture);

        this.addChild(this.back, this.front, border, mask);
        this.pivot.x = this.width / 2;
        this.scale.set(0.334);
        this.position.set(100, 100);

        this.makeFlippable();
    }

    private addBack() {
        const backBackground = new PIXI.Graphics();
        backBackground.beginFill(0x07162B, 1);
        backBackground.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 36);
        backBackground.endFill();

        const backLogo = PIXI.Sprite.from(logoTexture);
        backLogo.anchor.set(0.5);
        backLogo.position.set(backBackground.width / 2, backBackground.height / 2);
        backLogo.scale.set(2.2);

        this.back.addChild(backBackground, backLogo);
        this.back.renderable = false;
    }

    private makeFlippable() {
        // Toggle front and back
        const flipTw = gsap.to(this, {
            pixi: { scaleX: 0 },
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            onRepeat: () => {
                this.front.renderable = !this.front.renderable;
                this.back.renderable = !this.back.renderable;
            },
            paused: true
        });

        this.interactive = true;
        this.on('pointertap', () => {
            if (!flipTw.isActive()) {
                flipTw.restart();
            }
        });
    }
}