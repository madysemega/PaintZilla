import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/classes/shape-tool';
import { ShapeType } from '@app/classes/shape-type';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeTool {
    private readonly CIRCLE_MAX_ANGLE: number = 360;

    private startPoint: Vec2 = { x: 0, y: 0 };
    private strokeWidth: number = 1;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.name = 'ellipse';
    }

    adjustLineWidth(lineWidth: number): void {
        this.strokeWidth = lineWidth;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startPoint = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.drawEllipse(this.drawingService.baseCtx, this.startPoint, mousePosition);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.startPoint, mousePosition);
            this.drawPerimeter(this.drawingService.previewCtx, this.startPoint, mousePosition);
        }
    }

    private drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        const DASH_NUMBER = 8;

        const topLeft: Vec2 = {
            x: Math.min(startPoint.x, endPoint.x),
            y: Math.min(startPoint.y, endPoint.y),
        };

        const dimensions: Vec2 = {
            x: Math.abs(endPoint.x - startPoint.x),
            y: Math.abs(endPoint.y - startPoint.y),
        };

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([DASH_NUMBER]);
        ctx.strokeStyle = '#888';
        ctx.rect(topLeft.x, topLeft.y, dimensions.x, dimensions.y);
        ctx.stroke();
        ctx.restore();
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
        const center: Vec2 = {
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2,
        };

        const radii: Vec2 = {
            x: Math.abs(endPoint.x - startPoint.x) / 2,
            y: Math.abs(endPoint.y - startPoint.y) / 2,
        };

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = this.strokeWidth;
        ctx.fillStyle = '#AAA';
        ctx.strokeStyle = '#000';
        ctx.ellipse(center.x, center.y, radii.x, radii.y, 0, 0, this.CIRCLE_MAX_ANGLE);
        if (this.shapeType === ShapeType.Contoured || this.shapeType === ShapeType.ContouredAndFilled) {
            ctx.stroke();
        }
        if (this.shapeType === ShapeType.Filled || this.shapeType === ShapeType.ContouredAndFilled) {
            ctx.fill();
        }
        ctx.restore();
    }
}
