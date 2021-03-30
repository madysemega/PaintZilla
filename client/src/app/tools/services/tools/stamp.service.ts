import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';

@Injectable({
    providedIn: 'root',
})
export class StampService extends ShapeTool implements ISelectableTool {
    lastMousePosition: Vec2 = { x: 0, y: 0 };
    constructor(drawingService: DrawingService, private history: HistoryService) {
        super(drawingService);
        this.key = 'stamp';
        this.lineWidth = 1;
    }
    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }
    draw(ctx: CanvasRenderingContext2D, pos: Vec2): void {
        const BASE_IMAGE = new Image();
        BASE_IMAGE.src = '../assets/icons/black-stamp.svg';
        ctx.drawImage(BASE_IMAGE, pos.x, pos.y, 100, 100);
    }
    onMouseDown(event: MouseEvent): void {
        this.draw(this.drawingService.baseCtx, this.getPositionFromMouse(event));
        this.history.isLocked = true;
    }
}
