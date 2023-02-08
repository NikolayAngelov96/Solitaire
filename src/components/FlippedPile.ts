import { CARD_SIZE } from "../Constants";
import { Board } from "./Board";
import { FlipArea } from "./FlipArea";

export class FlippedPile extends FlipArea {

    constructor(board: Board) {
        super(board);
        this.position.set(CARD_SIZE.w * 1.5 + 20 + 10, 50);
    }
}