import * as PIXI from 'pixi.js';
import { ITextStyle } from 'pixi.js';
import { colors, textStyle } from '../Constants';
import { cursor } from './Cursor';
import { mask } from '../utils';

export class Input extends PIXI.Container {
    private background = new PIXI.Graphics();
    public element = new PIXI.Text('', new PIXI.TextStyle(textStyle as ITextStyle));

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
        this.background.lineStyle(3, colors.border);
        this.background.beginFill(colors.darkBg);
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
        cursor.goTo(this);
        cursor.element.x = this.element.width;
        this.on('destroyed', () => {
            cursor.clearListeners();
        })
    }
}