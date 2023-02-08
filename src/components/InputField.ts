import * as PIXI from 'pixi.js';
import { ITextStyle } from 'pixi.js';
import { COLORS, TEXT_STYLE } from '../Constants';
import { Cursor } from './Cursor';
import { mask } from '../utils';

export class Input extends PIXI.Container {
    private background = new PIXI.Graphics();
    public element = new PIXI.Text('', new PIXI.TextStyle(TEXT_STYLE as ITextStyle));
    public cursorElement = Cursor.getCursor();

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
    ) {
        super();

        // Set position and add background 
        this.width = w;
        this.height = h;
        this.pivot.set(w / 2, h / 2);
        this.position.set(x, y);
        this.background.lineStyle(3, COLORS.border);
        this.background.beginFill(COLORS.darkBg);
        this.background.drawRoundedRect(0, 0, w, h, 10);
        this.background.endFill();
        this.addChild(this.background);

        // Container to mask the excessive text in the input
        const maskContainer = mask(20, 0, this.width, this.height);
        this.addChild(maskContainer);

        // Input text element
        this.element.anchor.set(0, 0.5);
        this.element.y = this.height / 2;
        maskContainer.addChild(this.element);

        // Cursor
        this.cursorElement.goTo(this);
        this.cursorElement.element.x = this.element.width;
    }
}