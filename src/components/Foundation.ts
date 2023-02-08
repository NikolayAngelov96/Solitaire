import { Card } from "./Card";
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

    public validateCard(card: Card) {
        // Card is first Ace OR same suit as last card and 1 rank higher
        return (card.faceUp == true && this.cardsCount == 0 && card.power == 1 ||
            card.faceUp == true && this.cardsCount > 0 && card.suit == (this.destination as Card).suit && card.power == (this.destination as Card).power + 1);
    }

    // public setCardsFromState(cards: { face: number, suit: string, faceUp: boolean; }[]) {
    //     for (const card of cards) {
    //         const current = this.gameManager.cardFactory.getCard();
    //         // let cardId = getCardId(card.face, card.suit);
    //         current.setFront(card.face, card.suit);
    //         current.goTo(this, card.faceUp);
    //     }
    // }
}