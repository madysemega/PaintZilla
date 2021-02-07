import { Injectable } from '@angular/core';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';

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
export class EraserService extends ResizableTool {
    lineWidth: number;
    private currentSegmentIndex: number;
    private segments: Vec2[][];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.currentSegmentIndex = 0;
        this.segments = [];
        this.name = 'Efface';
        this.key = 'eraser';
    }

    adjustLineWidth(lineWidth: number): void {
        this.lineWidth = lineWidth;
        this.drawingService.previewCtx.lineWidth = lineWidth;
        this.drawingService.baseCtx.lineWidth = lineWidth;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown && this.mouseInCanvas) {
            this.clearSegments();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.createNewSegment(this.mouseDownCoord);

        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown && this.mouseInCanvas) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.segments[this.currentSegmentIndex]) this.segments[this.currentSegmentIndex].push(mousePosition);

            this.drawSegments(this.drawingService.baseCtx);
 
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
        this.drawingService.baseCtx.save();
        this.drawingService.previewCtx.save();
        this.adjustLineWidth(this.lineWidth);
        ctx.strokeStyle = 'white';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        this.drawingService.baseCtx.restore();
        this.drawingService.previewCtx.restore();
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
}
