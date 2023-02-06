import * as PIXI from "pixi.js";
import { ITextStyle } from "pixi.js";
import { Button } from "./Button";
import { colors, textStyle } from "../Constants";
import { GameManager } from "../GameManager";
import { Input } from "./InputField";

export class ConnectionDialogue extends PIXI.Container {
    private modal = new PIXI.Graphics();
    private input: Input;

    constructor(
        private app: PIXI.Application,
        private gameManager: GameManager,
        private shuffleAndDealCards: () => void
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
        this.modal.drawRoundedRect(0, 0, 0.5 * this.app.view.width, 0.30 * this.app.view.height, 15);
        this.modal.endFill();
        this.modal.pivot.set(this.modal.width / 2, this.modal.height / 2);
        this.modal.position.set(this.app.view.width / 2, this.app.view.height / 2);
        containerBg.addChild(this.modal);

        // Close button
        const closeBtn = new Button('Connect', this.modal.width / 2, this.modal.height - 50, 100, 50, colors.blueBtn);
        closeBtn.attachEventListener('pointertap', this.onSubmit.bind(this));
        this.modal.addChild(closeBtn);

        // Input field
        this.addText();
        this.addTextInput();
        this.input.cursorElement.onEnter = this.onSubmit.bind(this);

        this.on('destroyed', this.shuffleAndDealCards);

        this.app.stage.addChild(this);
    }

    private addText() {
        const text = new PIXI.Text('Enter your nickname:', new PIXI.TextStyle(textStyle as ITextStyle));
        text.anchor.set(0.5);
        text.position.set(this.modal.width / 2, 50);
        this.modal.addChild(text);
    }

    private addTextInput() {
        this.input = new Input(this.modal.width / 2, this.modal.height / 2, 300, 50)
        this.modal.addChild(this.input);
    }

    private onSubmit() {
        this.gameManager.connect(this.input.element.text, this);
    }
}