import {fabric} from "fabric";


declare module 'fabric' {
    namespace fabric {
        interface IText {
            setCurvedTextPath(): void;
        }
        interface ITextOptions {
            curved?: boolean;
            curveRadius?: number;
            curveReverse?: boolean;
            curveSelectable?: boolean;
        }
    }
}

// Function to draw a circle path
const drawCirclePath = (cx: number, cy: number, r: number): string => {
  return `M${cx},${cy}m${-r},0a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;
};
// Extend fabric.IText prototype to add setCurvedTextPath method
(fabric.IText.prototype as any).setCurvedTextPath = function (): void {
    if (this.curved) {
        const path = new fabric.Path(drawCirclePath(0, 0, this.curveRadius), {
            visible: false,
            selectable: this.curveSelectable,
        });

        this.set('path', path);
        (this as any).setCurvedTextPosition();
    }
};

// Extend fabric.IText prototype to add setCurvedTextPosition method
(fabric.IText.prototype as any).setCurvedTextPosition = function (): void {
    if (this.curved && this.path) {
        this.pathSide = this.curveReverse ? 'left' : 'right';
        const offset = this.curveReverse
            ? Math.PI * this.curveRadius * 2 * 0.25
            : Math.PI * this.curveRadius / 2;
        this.pathStartOffset = offset - this.calcTextWidth() / 2;
        this.pathAlign = 'center';
    }
};

// Extend fabric.IText prototype to add setCurvedTextPosition method
(fabric.IText.prototype as any).getLength = function (): void {
    console.log(this.stateProperties)
};