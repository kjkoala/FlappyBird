export class InputHandler {
    constructor(callback) {
        window.addEventListener('mousedown', callback, {
            passive: true
        })
    }
}