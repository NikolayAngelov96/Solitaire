import { Container, Graphics } from "pixi.js";
import { CARD_SIZE, COLORS } from "../Constants";
import { Board } from "./Board";
import { Card } from "./Card";

export abstract class FlipArea extends Container {
    protected _area = new Graphics();

    constructor(board: Board) {
        super();

        this.createArea();
        this.interactive = true;
        this.on('pointerup', () => board.gameManager.draggingCard?.goBack());
    }

    get cards() {
        return this.children.filter(c => c instanceof Card) as Card[];
    }

    get destination() {
        return this;
    }

    get destinationGlobalPosition() {
        return this.getGlobalPosition();
    }

    protected createArea() {
        this._area.beginFill(COLORS.cardPlaceholder);
        this._area.drawRoundedRect(0, 0, CARD_SIZE.w, CARD_SIZE.h, 12);
        this._area.endFill();
        this.pivot.x = CARD_SIZE.w / 2;
        this.addChild(this._area);
    }
}