import { Container, FederatedPointerEvent, Graphics, Text, DisplayObjectEvents } from "pixi.js";

export class Button extends Container {
    private _rect: Graphics;

    constructor(label: string, x: number, y: number, width: number, height: number, backgroundColor: number) {
        super();

        this._rect = this.createRect(x, y, width, height, backgroundColor);

        this.addLabel(label);
    }

    private createRect(x: number, y: number, width: number, height: number, backgroundColor: number): Graphics {
        const rect = new Graphics();
        rect.beginFill(backgroundColor);
        rect.drawRoundedRect(0, 0, width, height, 8);
        rect.endFill();

        rect.position.set(x, y);

        this.addChild(rect);

        return rect;
    }

    private addLabel(label: string) {
        const text = new Text(label, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 'white'
        });

        text.anchor.set(0.5);
        text.position.set(this._rect.width / 2, this._rect.height / 2);

        this._rect.addChild(text);

    }

    attachEventListener(type: keyof DisplayObjectEvents, callback: (e: FederatedPointerEvent) => void) {
        this.interactive = true;
        this.cursor = 'pointer';

        this.on(type, callback)
    }
}