import { Container, Graphics } from "pixi.js";
import { CardArea } from "./CardArea";

export class Foundation extends CardArea {

    constructor(width: number, height: number) {
        super(width, height);

    }

    addCard(): void { };
}