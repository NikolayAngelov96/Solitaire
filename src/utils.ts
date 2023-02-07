import { Container, Graphics } from 'pixi.js';
import { Ranks, Suits } from './Constants';

export function mask(x: number, y: number, w: number, h: number) {
    // Container
    const container = new Container();
    container.position.set(x, y);
    container.width = w - 2 * x;
    container.height = h - 2 * y;
    container.x = x;

    // The mask element
    const mask = new Graphics();
    mask.beginFill(0x000000, 1);
    mask.drawRect(0, 0, w - 2 * x, h - 2 * y);
    mask.endFill();
    container.mask = mask;
    container.addChild(mask);

    return container;
}

export function getCardId(face: number, suit: string) {
    let ranks = [...Object.values(Ranks)];
    return ranks[face - 1] + Suits[suit.at(0).toUpperCase() + suit.slice(1)];
}