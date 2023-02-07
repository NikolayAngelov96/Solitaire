export enum Suites {
    Clubs = 'C',
    Hearts = 'H',
    Spades = 'S',
    Diamonds = 'D'
}

export enum Ranks {
    ACE = 'A',
    N2 = '2',
    N3 = '3',
    N4 = '4',
    N5 = '5',
    N6 = '6',
    N7 = '7',
    N8 = '8',
    N9 = '9',
    N10 = '10',
    JACK = 'J',
    QUEEN = 'Q',
    KING = 'K',
}

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