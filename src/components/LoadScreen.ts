import * as PIXI from 'pixi.js';
import { COLORS } from '../Constants';
import gsap from 'gsap';

export class LoadScreen extends PIXI.Container {
    private progressBar = new PIXI.Graphics();

    constructor(app: PIXI.Application) {
        super();
        this.addText();
        this.addLoadbar();
        this.position.set(app.view.width / 2, app.view.height / 2);
        app.stage.addChild(this);
    }

    private addText() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 42,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: COLORS.border,
            stroke: COLORS.darkBg,
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });

        const richText = new PIXI.Text('Loading...', style);
        richText.anchor.set(0.5);
        richText.y = - richText.height / 2;
        this.addChild(richText);
    }

    private addLoadbar() {
        const barBg = new PIXI.Graphics();
        barBg.lineStyle(6, COLORS.border, 1);
        barBg.beginFill(0xFFFFFF);
        barBg.drawRoundedRect(0, 0, 500, 30, 30);
        barBg.endFill();
        barBg.pivot.set(barBg.width / 2, 0);
        barBg.y = 10;

        const progressContainer = new PIXI.Container();
        barBg.addChild(progressContainer);
        const barMask = new PIXI.Graphics();
        barMask.beginFill(0xFFFFFF);
        barMask.drawRoundedRect(3, 3, 494, 24, 30);
        barMask.endFill();
        progressContainer.mask = barMask;
        progressContainer.addChild(barMask);

        this.progressBar.beginFill(COLORS.darkBg);
        this.progressBar.drawRect(0, 0, 500, 60);
        this.progressBar.endFill();
        this.progressBar.scale.x = 0.05;
        progressContainer.addChild(this.progressBar);

        this.addChild(barBg);
    }

    public progress(n: number) {
        gsap.to(this.progressBar, {
            pixi: {
                scaleX: n
            },
            delay: 0.3,
            onComplete: () => {
                if (n == 1) {
                    this.destroy();
                }
            }
        });
    }
}