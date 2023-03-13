import { handlerType } from "./matchMedia.js"
export class InputHandler {
    constructor(callback) {
        window.addEventListener(handlerType, callback, {
            passive: true,
            capture: true
        })
    }
}