import { Container, Graphics } from "pixi.js";
import { colors } from './Constants';

export abstract class CardArea extends Container {
    protected placeholderColor: number = colors.cardPlaceholder;

    constructor(width: number, height: number) {
        super();

        this.createArea(width, height);
    }

    protected createArea(width: number, height: number) {
        const area = new Graphics();
        area.beginFill(this.placeholderColor);
        area.drawRoundedRect(0, 0, width, height, 12);
        area.endFill();
        this.pivot.x = width / 2;
        this.addChild(area);
    }
}