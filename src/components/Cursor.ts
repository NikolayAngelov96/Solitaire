import { Text, TextStyle, ITextStyle } from "pixi.js";
import { textStyle } from "../Constants";
import { Input } from "./InputField";

export class Cursor {
    private static instance: Cursor;

    public element = new Text('|', new TextStyle(textStyle as ITextStyle));
    public target: Text;
    public onEnter = () => { };
    private _blinkId: NodeJS.Timer;
    private _keyboardListener: (e: KeyboardEvent) => void;

    private constructor() {
        this.element.anchor.set(0, 0.55);
        this.element.renderable = true;
        this._keyboardListener = this.onInput.bind(this);
        document.body.addEventListener('keydown', this._keyboardListener);
        this.blink();
    }

    public static getCursor(): Cursor {
        if (!this.instance) {
            this.instance = new Cursor();
        }

        return this.instance;
    }

    public goTo(input: Input) {
        this.target = input.element;
        this.target.addChild(this.element);
        this.element.x = this.target.width;
    }

    public fixPosition() {
        this.element.x = this.target.width;

        if (this.target.width >= this.target.parent.parent.width - 45) {
            this.target.position.x = this.target.parent.parent.width - 45 - this.target.width;
        } else {
            this.target.position.x = 0;
        }
    }

    async onInput({ key, code, ctrlKey }: KeyboardEvent) {

        if (ctrlKey && code == 'KeyV') { // Paste
            this.target.text += await navigator.clipboard.readText();
        } else if (key == 'Backspace') {
            this.target.text = this.target.text.slice(0, -1);
        } else if (key == 'Enter') {
            this.onEnter();
            return;
        } else if (key.length == 1) {
            this.target.text += key;
        }

        this.fixPosition();
    }

    private blink() {
        this._blinkId = setInterval(() => {
            this.element.renderable = !this.element.renderable;
        }, 500);
    }

    public clearListeners() {
        clearInterval(this._blinkId);
        document.body.removeEventListener('keydown', this._keyboardListener);
    }
}