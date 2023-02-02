import { Text, TextStyle, ITextStyle } from "pixi.js";
import { textStyle } from "../Constants";
import { Input } from "./InputField";

export class Cursor {
    public element = new Text('|', new TextStyle(textStyle as ITextStyle));
    public target: Text;
    public onEnter = () => { };

    constructor() {
        this.element.anchor.set(0, 0.55);
        this.element.renderable = true;
        document.body.addEventListener('keydown', this.onInput.bind(this));

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
            cursor.target.text += await navigator.clipboard.readText();
        } else if (key == 'Backspace') {
            cursor.target.text = cursor.target.text.slice(0, -1);
        } else if (key == 'Enter') {
            this.onEnter();
        } else if (key.length == 1) {
            cursor.target.text += key;
        }

        this.fixPosition();
    }
}

export const cursor = new Cursor();