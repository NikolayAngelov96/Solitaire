import { Card } from "./Card";
import { CardArea } from "./CardArea";
import { GameManager } from "../GameManager";
import { getCardId } from "../utils";
import { Suites } from "../Constants";

export class Foundation extends CardArea {
    public suit: Suites;

    constructor(width: number, height: number, suit: Suites, gameManager: GameManager) {
        super(width, height, gameManager);
        this.suit = suit;
    }

    public validateCard(card: Card) {
        // Validate from the backend if the card can go in the column
        // return (card.faceUp == true && this.cardsCount > 0 && card.suite == (this.destination as Card).suite && card.power == (this.destination as Card).power + 1 ||
        //     card.faceUp == true && this.cardsCount == 0 && card.power == 0);

        // TODO: fix foundation suit
        return card.suite == this.suit;
    }

    public setCardsFromState(cards: { face: number, suit: string, faceUp: boolean }[]) {
        for (const card of cards) {
            const current = this.gameManager.cardFactory.getCard();
            let cardId = getCardId(card.face, card.suit);
            current.setFront(cardId);
            current.goTo(this, card.faceUp);
        }
    }
}