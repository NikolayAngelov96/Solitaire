# Solitaire

### Move Package
```ts
{
    action: 'flip' | 'place' | 'take',
    source: 'pile' + ${PileIndex} | 'foundation' = ${foundationSuit} | 'stock';
    target: null | // except in action == 'place'
    index: 'card index' // maybe not important 
}

if(action == 'place') {
    target = {newSlot}
    source = {oldSlot}
    index = {oldSlot}
}
```