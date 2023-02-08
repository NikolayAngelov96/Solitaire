import { Container, Graphics } from "pixi.js";
import { Card } from "./Card";
import { COLORS } from '../Constants';
import { GameManager } from "../GameManager";

export abstract class CardArea extends Container {
    protected placeholderColor: number = COLORS.cardPlaceholder;

    protected constructor(width: number, height: number, protected gameManager: GameManager) {
        super();

        this.createArea(width, height);

        this.interactive = true;
        this.on('pointerup', () => {
            if (gameManager.draggingCard) {
                if (this.validateCard(gameManager.draggingCard)) {
                    gameManager.draggingCard.goTo(this as any);
                } else {
                    gameManager.draggingCard.goBack();
                }
            }
        });
    }

    protected createArea(width: number, height: number) {
        const area = new Graphics();
        area.beginFill(this.placeholderColor);
        area.drawRoundedRect(0, 0, width, height, 12);
        area.endFill();
        this.pivot.x = width / 2;
        this.addChild(area);
    }

    get destinationGlobalPosition() {
        return this.destination.getGlobalPosition();
    }

    get destination() {
        return this.getDestination();
    }

    get cardsCount() {
        return this.getCardsCount();
    }

    protected getDestination(current: any = this) {
        if (current.children.at(-1) instanceof Card) {
            return this.getDestination(current.children.at(-1));
        }

        return current;
    }

    protected getCardsCount(current: any = this, count = 0): number {
        if (current.children.at(-1) instanceof Card) {
            count++;
            return this.getCardsCount(current.children.at(-1), count);
        }

        return count;
    }

    abstract validateCard(card: Card): boolean;
}