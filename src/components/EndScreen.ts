import * as PIXI from "pixi.js";
import { gsap } from 'gsap';
import { CardFactory } from "../CardFactory";
import { Button } from "./Button";
import { Board } from "./Board";

export class EndScreen extends PIXI.Container {
    private text: PIXI.Text;
    private button: Button;
    constructor(
        private app: PIXI.Application,
        private cardFactory: CardFactory,
        private board: Board,
    ) {
        super();
        this.button = new Button('New Game', app.stage.width / 2, app.stage.height / 2, 145, 38, 0x28a745);
        this.button.attachEventListener('pointerdown', () => {
            window.location.reload();
        });

        const blur = new PIXI.BlurFilter();
        this.board.filters = [blur];

        app.stage.addChild(this);

    };

    public animateWin() {
        let cards: PIXI.DisplayObject[] = [];

        for (let i = 0; i < 100; i++) {
            cards.push(this.cardFactory.getCard());
        }

        this.addChild(...cards);

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
            stagger: {
                amount: 4
            },

            onComplete: () => this.addText()
        });
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
            .to(this.text, { pixi: { scale: 1.2 }, repeat: -1, yoyo: true, ease: 'sine' }, '<0.7');

    }

    public animateLoosing() {
        let centerX = this.app.stage.width / 2;
        let centerY = this.app.stage.height / 2;
        this.addLosingText();
        this.text.position.set(centerX, centerY - 120);
        this.addChild(this.button);

        const tl = gsap.timeline();


        tl.from(this.button, {
            pixi: {
                y: 800,
            },
            duration: 1
        }).from(this.text, {
            pixi: {
                y: 0,
                blur: 10
            },
            duration: 1
        }, '<');
    }

    private addLosingText() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fontWeight: 'bold',
            fill: '#E02424',
            dropShadow: true,
            dropShadowAlpha: 0.3,
            dropShadowBlur: 2,
            letterSpacing: 1,
        });

        this.text = new PIXI.Text('Game Over', style);
        this.text.anchor.set(0.5);

        this.addChild(this.text);
    }
}