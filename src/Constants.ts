export enum Suits {
    clubs = 'C',
    hearts = 'H',
    spades = 'S',
    diamonds = 'D'
}

export type SuitsKey = keyof typeof Suits;

export const RANKS = ['_', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const CARD_SHEET = {
    startX: 47.5,
    startY: 848,
    w: 409,
    h: 623,
    marginX: 49.4,
    marginY: 37
};

export const CARD_SIZE = {
    w: CARD_SHEET.w * 0.334,
    h: CARD_SHEET.h * 0.334
};


export const COLORS = {
    mainBg: 0x005000,
    cardPlaceholder: 0x196119,
    greenBtn: 0x28a745,
    blueBtn: 0x17a2b8,
    border: 0xa6ce39,
    darkBg: 0x07162B
};

export const TEXT_STYLE = {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'left',
};

type CardState = {
    face: number,
    suit: keyof typeof Suits,
    faceUp: boolean;
};

type EntityType = 'stock' | 'waste' | 'foundation' | 'pile';

export type EntityState = {
    cards: CardState[],
    type: EntityType,
    suit: keyof typeof Suits;
};

export type GameState = {
    stock: EntityState,
    waste: EntityState,
    foundations: {
        [key in keyof typeof Suits]: EntityState
    },
    piles: EntityState[];
};

type Actions = {
    flip: boolean,
    place: boolean,
    take: number[];
};

export type Moves = {
    stock: Actions,
    waste: Actions,
    piles: Actions[],
    foundations: {
        [key in keyof typeof Suits]: Actions
    };
};