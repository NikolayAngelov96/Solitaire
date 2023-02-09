import { CardArea } from "./CardArea";
import { GameManager } from "../GameManager";
import { Suits } from "../Constants";

export class Foundation extends CardArea {
    constructor(
        width: number,
        height: number,
        public suit: keyof typeof Suits,
        gameManager: GameManager
    ) {
        super(width, height, gameManager);
    }
}