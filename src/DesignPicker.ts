import * as PIXI from "pixi.js";
import { Button } from "./Button";
import { GameManager } from "./GameManager";
import { SampleCard } from "./SampleCard";

export class DesignPicker extends PIXI.Container {

    constructor(
        private app: PIXI.Application,
        private gameManager: GameManager
    ) {
        super();
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.5);
        background.drawRect(0, 0, this.app.stage.width, this.app.stage.height);
        background.endFill();
        background.interactive = true;
        this.addChild(background);

        const closeBtn = new Button('Done', this.app.stage.width / 2, 500, 100, 50, 0x17a2b8);
        closeBtn.attachEventListener('pointertap', this.destroy.bind(this));
        this.addChild(closeBtn);

        this.app.stage.addChild(this);

        this.generateSamples();
    }

    private generateSamples() {

        const [sample1, sample2, sample3] = this.gameManager.sampleCards;

        [sample1, sample2, sample3].forEach(sample => {
            sample.position.set(this.app.stage.width / 2, 200);
            sample.interactive = true;

            sample.on('pointerdown', () => sample.y += 10);
            sample.on('pointerup', onPointerUp.bind(this, sample));
            sample.on('pointerupoutside', onPointerUp.bind(this, sample));
        });

        sample1.x -= 200;
        sample3.x += 200;

        this.addChild(sample1, sample2, sample3);

        function onPointerUp(sample: SampleCard) {
            sample.y -= 10;
            this.gameManager.cardsLogo = (sample.back.children[1] as PIXI.Sprite).texture;
        }
    }
}