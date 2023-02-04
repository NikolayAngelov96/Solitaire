import { Container, Graphics } from "pixi.js";
import { cardSize, colors } from "../Constants";

export abstract class FlipArea extends Container {
    protected _area = new Graphics();

    constructor() {
        super();

        this.createArea();
    }

    get destination() {
        return this;
    }

    get destinationGlobalPosition() {
        return this.getGlobalPosition();
    }

    protected createArea() {
        this._area.beginFill(colors.cardPlaceholder);
        this._area.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 12);
        this._area.endFill();
        this.pivot.x = cardSize.w / 2;
        this.addChild(this._area);
    }
}