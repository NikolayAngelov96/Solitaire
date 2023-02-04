import { cardSize } from "../Constants";
import { FlipArea } from "./FlipArea";

export class FlippedPile extends FlipArea {

    constructor() {
        super();
        this.position.set(cardSize.w * 1.5 + 20 + 10, 50);
    }
}