import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

// Ceci est une implémentation de base de l'outil Crayon pour aider à débuter le projet
// L'implémentation ici ne couvre pas tous les critères d'accepetation du projet
// Vous êtes encouragés de modifier et compléter le code.
// N'oubliez pas de regarder les tests dans le fichier spec.ts aussi!
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    lineWidth: number;
    private currentSegmentIndex: number;
    private segments: Vec2[][];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.currentSegmentIndex = 0;
        this.segments = [];
    }

    onMouseDown(event: MouseEvent): void {
        this.setLineWidth(this.lineWidth);
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown && this.mouseInCanvas) {
            this.clearSegments();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.createNewSegment(this.mouseDownCoord);
            this.drawPoint(this.drawingService.previewCtx, this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown && this.mouseInCanvas) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.segments[this.currentSegmentIndex]) this.segments[this.currentSegmentIndex].push(mousePosition);

            this.drawSegments(this.drawingService.baseCtx);
            this.drawPoint(this.drawingService.baseCtx, this.mouseDownCoord);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDown = false;
        this.clearSegments();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.segments[this.currentSegmentIndex].push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSegments(this.drawingService.previewCtx);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.mouseInCanvas = false;
    }

    onMouseEnter(event: MouseEvent): void {
        this.mouseInCanvas = true;
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.createNewSegment(mousePosition);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private drawPoint(ctx: CanvasRenderingContext2D, point: Vec2): void {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    private drawSegments(ctx: CanvasRenderingContext2D): void {
        for (const segment of this.segments) {
            if (segment) this.drawLine(ctx, segment);
        }
    }

    private clearSegments(): void {
        this.segments = [];
    }

    private createNewSegment(initialPoint: Vec2): void {
        this.currentSegmentIndex++;
        this.segments[this.currentSegmentIndex] = [];
        this.segments[this.currentSegmentIndex].push(initialPoint);
    }

    setLineWidth(width: number): void {
        this.drawingService.previewCtx.lineWidth = width;
        this.drawingService.baseCtx.lineWidth = width;
    }
}
