export enum Suits {
    clubs = 'C',
    hearts = 'H',
    spades = 'S',
    diamonds = 'D'
}

export const Ranks = ['_', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// export type CardsIds = 'AS' | '1S' | '2S' ...


export const cardSheet = {
    startX: 47.5,
    startY: 848,
    w: 409,
    h: 623,
    marginX: 49.4,
    marginY: 37
};

export const cardSize = {
    w: cardSheet.w * 0.334,
    h: cardSheet.h * 0.334
};


export const colors = {
    mainBg: 0x005000,
    cardPlaceholder: 0x196119,
    greenBtn: 0x28a745,
    blueBtn: 0x17a2b8,
    border: 0xa6ce39,
    darkBg: 0x07162B
};

export const textStyle = {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'left',
};