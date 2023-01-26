import * as PIXI from 'pixi.js';
import { cardSize, Ranks, Suites } from './Constants';

export class Card extends PIXI.Container {
    private front: PIXI.Sprite;
    private back: PIXI.Sprite;
    public suite: Suites;
    public rank: Ranks;
    public power: number;

    constructor(texture: PIXI.Texture) {
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

        this.front = PIXI.Sprite.from(texture);
        this.addChild(this.front, border, mask);
        this.scale.set(0.333);
    }
}