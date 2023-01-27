import * as PIXI from 'pixi.js';
import { Card } from './Card';
import { cardSheet, cardSize, Ranks, Suites } from './Constants';

export type images = 'cards' | 'logo';

export type Assets = {
    [key in images]: PIXI.Texture;
};

export type Cards = {
    [key: string]: Card;
};

export class Deck {
    private cards: Cards = {};

    constructor(private assets: Assets) {
        this.generateCards();
    }

    private generateCards() {
        // Generate back of card

        for (let suiteIndex = 0; suiteIndex < [...Object.values(Suites)].length; suiteIndex++) {
            const suite = Object.values(Suites)[suiteIndex];

            for (let rankIndex = 0; rankIndex < [...Object.values(Ranks)].length; rankIndex++) {
                const rank = Object.values(Ranks)[rankIndex];

                const x = cardSheet.startX + (rankIndex * (cardSize.w + cardSheet.marginX));
                const y = cardSheet.startY + (suiteIndex * (cardSize.h + cardSheet.marginY));

                const card = new Card(this.assets.cards, x, y, this.assets.logo);
                this.cards[`${rank}${suite}`] = card;
            }
        }
    }

    public get(card: string) {
        console.log(this.cards);
        return this.cards[card];
    }
}