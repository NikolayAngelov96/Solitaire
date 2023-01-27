# Solitaire

## Loading screen

## Card.ts

1. Initiate with unknown front - done
2. Setter for the front - done
3. goTo(pile) method to move to a pile
4. dragging functionality - done

## GameManager.ts

1.  Load board state from backend

- fill card deck (front up)
- fill 7 slots with cards

2. public selectedCard - property of the card currently dragging

## Foundation piles

- public lastCard property - last inserted card (container) so the new card can go into it
- 'pointerup' event to call:
  - gameManager.selectedCard.goTo(this.lastCard)
  - clear gameManager.selectedCard

## Card columns (Fans)

- public destination property - last inserted card (container) so the new card can go into it
- 'pointerup' event to call:
  - gameManager.selectedCard.goTo(this.lastCard)
  - clear gameManager.selectedCard
