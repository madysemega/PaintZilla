import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    mouseInCanvas: boolean;
    name: string;
    key: string;

    constructor(protected drawingService: DrawingService) {}

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
      /*  let clientX : number = event.clientX;
        let clientY : number = event.clientY;
        let canvaCoords : DOMRect = (document.getElementById("drawingComponent")?.getBoundingClientRect() as DOMRect);
        let x : number = clientX - canvaCoords.x;
        let y : number = clientY - canvaCoords.y;
        return { x: x, y: y };*/
        return {x: event.offsetX, y: event.offsetY};
    }
}
