export class InputHandler {
    constructor(callback) {
        window.addEventListener('touchstart', callback, {
            passive: true
        })
    }
}