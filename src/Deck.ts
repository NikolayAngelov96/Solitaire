import * as PIXI from 'pixi.js';
import { Card, CardFrontsTextures } from './Card';
import { cardSheet, cardSize, Ranks, Suites } from './Constants';

export type images = 'cards' | 'logo';

export type Assets = {
    [key in images]: PIXI.Texture;
};

export type Cards = {
    [key: string]: Card;
};

export class Deck {
    public cards: Set<Card> = new Set();
    private cardFrontsTextures: CardFrontsTextures = {};

    constructor(private assets: Assets) {
        this.generateFrontsTextures();
    }

    private generateFrontsTextures() {
        for (let suiteIndex = 0; suiteIndex < [...Object.values(Suites)].length; suiteIndex++) {
            const suite = Object.values(Suites)[suiteIndex];

            for (let rankIndex = 0; rankIndex < [...Object.values(Ranks)].length; rankIndex++) {
                const rank = Object.values(Ranks)[rankIndex];

                const x = cardSheet.startX + (rankIndex * (cardSize.w + cardSheet.marginX));
                const y = cardSheet.startY + (suiteIndex * (cardSize.h + cardSheet.marginY));

                const frontTexture = new PIXI.Texture(this.assets.cards.baseTexture, new PIXI.Rectangle(x, y, cardSize.w, cardSize.h));
                this.cardFrontsTextures[`${rank}${suite}`] = frontTexture;
            }
        }
    }

    public getCard() {
        const card = new Card(this.cardFrontsTextures, this.assets.logo);
        this.cards.add(card);
        return card;
    }
}