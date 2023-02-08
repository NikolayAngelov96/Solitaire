import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { CARD_SIZE, COLORS } from '../Constants';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class SampleCard extends PIXI.Container {
    private _back = new PIXI.Container();

    constructor(logoTexture: PIXI.Texture) {
        super();
        this.setBack(logoTexture);
        this.addBorder();
        this.addMask();

        this.pivot.x = this.width / 2;
        this.interactive = true;
    }

    get back() {
        return this._back;
    }

    public setBack(logoTexture: PIXI.Texture) {
        this._back.removeChildren();
        const backBackground = new PIXI.Graphics();
        backBackground.beginFill(COLORS.darkBg, 1);
        backBackground.drawRoundedRect(0, 0, CARD_SIZE.w, CARD_SIZE.h, 16);
        backBackground.endFill();

        const backLogo = PIXI.Sprite.from(logoTexture);
        backLogo.anchor.set(0.5);
        backLogo.position.set(backBackground.width / 2, backBackground.height / 2);
        backLogo.scale.set((CARD_SIZE.w - 20) / logoTexture.width);

        this._back.addChild(backBackground, backLogo);
        this.addChild(this._back);
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
        this._back.mask = mask;
        this.addChild(mask);
    }
}