import * as PIXI from "pixi.js";
import { gsap } from 'gsap';
import { CardFactory } from "./CardFactory";

export class EndScreen extends PIXI.Container {
    private text: PIXI.Text;
    constructor(app: PIXI.Application, private cardFactory: CardFactory) {
        super();

        this.animateWin();

        app.stage.addChild(this);

    };

    private animateWin() {
        let cards: PIXI.DisplayObject[] = [];

        for (let i = 0; i < 100; i++) {
            cards.push(this.cardFactory.getCard());
        }

        this.addChild(...cards)

        gsap.fromTo(cards, {
            pixi: {
                scale: 0
            }
        }, {
            pixi: {
                scale: 1,
                x: 'random(0, 1140)',
                y: 'random(0, 600)'
            },
            duration: 0.2,
            stagger: {
                amount: 4
            },

            onComplete: () => this.addText()
        })
    }

    private addText() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fontWeight: 'bold',
            dropShadow: true,
            fill: '#FDE047'
        });

        this.text = new PIXI.Text('You Won', style);
        this.text.anchor.set(0.5);
        this.text.position.set(this.width / 2, this.height / 2 - 200);

        this.addChild(this.text);
        this.pulseAnimation();
    }

    private pulseAnimation() {
        const tl = gsap.timeline()
            .from(this.text, { pixi: { scale: 0, rotation: 720 }, duration: 0.8 })
            .to(this.text, { pixi: { scale: 1.2 }, repeat: -1, yoyo: true, ease: 'sine' }, '<0.7')

    }
}