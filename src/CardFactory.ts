import * as PIXI from 'pixi.js';
import { Card, CardFrontsTextures } from './components/Card';
import { cardSheet, Ranks, Suits } from './Constants';
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
        for (let suitIndex = 0; suitIndex < [...Object.values(Suits)].length; suitIndex++) {
            const suit = Object.values(Suits)[suitIndex];

            for (let rank = 1; rank < Ranks.length; rank++) {
                const x = cardSheet.startX + ((rank - 1) * (cardSheet.w + cardSheet.marginX));
                const y = cardSheet.startY + (suitIndex * (cardSheet.h + cardSheet.marginY));

                const frontTexture = new PIXI.Texture(this.assets.cards.baseTexture, new PIXI.Rectangle(x, y, cardSheet.w, cardSheet.h));
                this.cardFrontsTextures[`${rank}${suit}`] = frontTexture;
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