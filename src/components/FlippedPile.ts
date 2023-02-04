import { Container, Graphics, Text } from "pixi.js";
import { cardSize, colors } from "../Constants";
import { Board } from "./Board";

export class FlippedPile extends Container {
    private _area = new Graphics();

    constructor() {
        super();

        this.createArea();
        this.pivot.x = cardSize.w / 2;
        this.position.set(cardSize.w * 1.5 + 20 + 10, 50);
    }

    get destination() {
        return this;
    }

    get destinationGlobalPosition() {
        return this.getGlobalPosition();
    }

    private createArea() {
        this._area.beginFill(colors.cardPlaceholder);
        this._area.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 12);
        this._area.endFill();
        this.addChild(this._area);
    }
}