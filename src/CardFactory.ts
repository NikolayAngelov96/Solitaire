import * as PIXI from 'pixi.js';
import { Card, CardFrontsTextures } from './components/Card';
import { cardSheet, Ranks, Suites } from './Constants';
import { GameManager } from './GameManager';
import { SampleCard } from './components/SampleCard';

export type images = 'cards' | 'logo' | 'logo2' | 'logo3' | 'logo4';

export type Assets = {
    [key in images]: PIXI.Texture;
};

export type Cards = {
    [key: string]: Card;
};

export class CardFactory {
    private cardFrontsTextures: CardFrontsTextures = {};
    private assets: Assets;

    constructor(private gameManager: GameManager) {
        this.assets = gameManager.assets;
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
        return new Card(this.cardFrontsTextures, this.assets.logo, this.gameManager);
    }

    public getSampleCards() {
        return [
            new SampleCard(this.assets.logo),
            new SampleCard(this.assets.logo2),
            new SampleCard(this.assets.logo3)
        ];
    }
}