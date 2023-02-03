import { Container, Graphics, Text } from "pixi.js";
import { cardSize, colors } from "../Constants";
import { Board } from "./Board";
import { Card } from "./Card";

export class FlippedPile extends Container {
    private _area = new Graphics();

    constructor(board: Board) {
        super();

        this.createArea();
        this.addText();
        this.pivot.x = cardSize.w / 2;
        this.position.set(cardSize.w * 1.5 + 20 + 10, 50);

        this.on('pointertapcapture', () => {
            if (board.deck.children.at(-1) instanceof Card == false) {
                console.log('Return cards');
            }
        });
    }

    get destinationGlobalPosition() {
        return this.getGlobalPosition();
    }

    get destination() {
        return this;
    }

    private createArea() {
        this._area.beginFill(colors.cardPlaceholder);
        this._area.drawRoundedRect(0, 0, cardSize.w, cardSize.h, 12);
        this._area.endFill();
        this.addChild(this._area);
    }

    private addText() {
        const text = new Text("Press SPACE\nTo Flip", {
            fontFamily: "Arial",
            fontSize: 16,
            align: "center"
        });

        text.anchor.set(0.5);
        text.position.set(this._area.width / 2, this._area.height / 2);

        this._area.addChild(text);
    }
}