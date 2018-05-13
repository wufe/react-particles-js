import { ISystemLibraryProxy } from "../interfaces";

export class SystemLibraryProxy implements ISystemLibraryProxy {

    closure: Function;
    canvas: HTMLCanvasElement;

    setNotifyClosure(closure: Function): void {
        this.closure = closure;
    }

    setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    notifyChange(): void {
        if (this.closure && typeof this.closure === 'function')
            this.closure();
    }
}