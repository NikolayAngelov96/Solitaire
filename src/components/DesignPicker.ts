import * as PIXI from "pixi.js";
import { Button } from "./Button";
import { colors } from "../Constants";
import { GameManager } from "../GameManager";
import { SampleCard } from "./SampleCard";
import { CardFactory } from "../CardFactory";

export class DesignPicker extends PIXI.Container {
    private modal = new PIXI.Graphics();

    constructor(
        private app: PIXI.Application,
        private gameManager: GameManager,
        private cardFactory: CardFactory
    ) {
        super();

        // Background
        const containerBg = new PIXI.Graphics();
        containerBg.beginFill(0x000000, 0.5);
        containerBg.drawRect(0, 0, this.app.view.width, this.app.view.height);
        containerBg.endFill();
        containerBg.interactive = true;
        this.addChild(containerBg);

        // Modal window
        this.modal.beginFill(colors.cardPlaceholder);
        this.modal.drawRoundedRect(0, 0, 0.5 * this.app.view.width, 0.45 * this.app.view.height, 15);
        this.modal.endFill();
        this.modal.pivot.set(this.modal.width / 2, this.modal.height / 2);
        this.modal.position.set(this.app.view.width / 2, this.app.view.height / 2);
        containerBg.addChild(this.modal);

        this.generateSamples();

        // Close button
        const closeBtn = new Button('Done', this.modal.width / 2, this.modal.height - 50, 100, 50, colors.blueBtn);
        closeBtn.attachEventListener('pointertap', () => this.destroy({ children: true }));
        this.modal.addChild(closeBtn);

        this.app.stage.addChild(this);
    }

    private generateSamples() {

        const [sample1, sample2, sample3] = this.cardFactory.getSampleCards();

        [sample1, sample2, sample3].forEach((sample, i) => {
            sample.position.set((1 + (i * 2)) * (this.modal.width / 6), 25);
            sample.interactive = true;

            sample.on('pointerdown', () => sample.y += 10)
                .on('pointerup', onPointerUp.bind(this, sample))
                .on('pointerupoutside', onPointerUp.bind(this, sample));
        });

        this.modal.addChild(sample1, sample2, sample3);

        function onPointerUp(sample: SampleCard) {
            sample.y -= 10;
            this.gameManager.cardsLogo = (sample.back.children[1] as PIXI.Sprite).texture;
        }
    }
}