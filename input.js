export class InputHandler {
    constructor(callback) {
        this.callback = callback;
        window.addEventListener('click', this.callback)
    }
}