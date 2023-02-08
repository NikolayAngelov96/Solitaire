import * as PIXI from 'pixi.js';
import { Card, CardFrontsTextures } from './components/Card';
import { CARD_SHEET, RANKS, Suits } from './Constants';
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

            for (let rank = 1; rank < RANKS.length; rank++) {
                const x = CARD_SHEET.startX + ((rank - 1) * (CARD_SHEET.w + CARD_SHEET.marginX));
                const y = CARD_SHEET.startY + (suitIndex * (CARD_SHEET.h + CARD_SHEET.marginY));

                const frontTexture = new PIXI.Texture(this.assets.cards.baseTexture, new PIXI.Rectangle(x, y, CARD_SHEET.w, CARD_SHEET.h));
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