import * as PIXI from 'pixi.js';
import { cardSize, Ranks, Suites } from './Constants';

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
        border.lineStyle(10, 0x000000);
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

        // Front
        const frontTexture = new PIXI.Texture(cardsTexture.baseTexture, new PIXI.Rectangle(x, y, cardSize.w, cardSize.h));
        this.front = PIXI.Sprite.from(frontTexture);

        // Back
        const backBackground = new PIXI.Graphics();
        backBackground.beginFill(0x07162B, 1);
        backBackground.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 36);
        backBackground.endFill();

        const backLogo = PIXI.Sprite.from(logoTexture);
        backLogo.anchor.set(0.5);
        backLogo.position.set(this.front.width / 2, this.front.height / 2);
        backLogo.scale.set(2.2);

        this.back.addChild(backBackground, backLogo);
        this.back.renderable = false;

        this.addChild(this.back, this.front, border, mask);
        this.scale.set(0.334);

        // Toggle front and back
        this.interactive = true;
        this.on('pointertap', () => {
            this.front.renderable = !this.front.renderable;
            this.back.renderable = !this.back.renderable;
        });
    }
}