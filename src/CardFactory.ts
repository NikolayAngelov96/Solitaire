import * as PIXI from 'pixi.js';
import { Card, CardFrontsTextures } from './Card';
import { cardSheet, cardSize, Ranks, Suites } from './Constants';
import { GameManager } from './GameManager';
import { SampleCard } from './SampleCard';

export type images = 'cards' | 'logo' | 'logo2' | 'logo3' | 'logo4';

export type Assets = {
    [key in images]: PIXI.Texture;
};

export type Cards = {
    [key: string]: Card;
};

export class CardFactory {
    private cardFrontsTextures: CardFrontsTextures = {};

    constructor(private assets: Assets, private gameManager: GameManager) {
        this.generateFrontsTextures();
    }

    private generateFrontsTextures() {
        for (let suiteIndex = 0; suiteIndex < [...Object.values(Suites)].length; suiteIndex++) {
            const suite = Object.values(Suites)[suiteIndex];

            for (let rankIndex = 0; rankIndex < [...Object.values(Ranks)].length; rankIndex++) {
                const rank = Object.values(Ranks)[rankIndex];

                const x = cardSheet.startX + (rankIndex * (cardSheet.w + cardSheet.marginX));
                const y = cardSheet.startY + (suiteIndex * (cardSheet.h + cardSheet.marginY));

                const frontTexture = new PIXI.Texture(this.assets.cards.baseTexture, new PIXI.Rectangle(x, y, cardSheet.w, cardSheet.h));
                this.cardFrontsTextures[`${rank}${suite}`] = frontTexture;
            }
        }
    }

    public getCard() {
        const card = new Card(this.cardFrontsTextures, this.assets.logo, this.gameManager);
        return card;
    }

    public getSampleCard() {
        return [
            new SampleCard(this.assets.logo),
            new SampleCard(this.assets.logo2),
            new SampleCard(this.assets.logo3)
        ];
    }
}