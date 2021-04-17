import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';
import { LassoSelectionHelperService } from './lasso-selection-helper.service';

@Injectable({
    providedIn: 'root',
})
export class LassoSelectionHandlerService extends SelectionHandlerService {
    initialVertices: Vec2[];
    translatedVertices: Vec2[];

    constructor(drawingService: DrawingService, protected selectionHelper: LassoSelectionHelperService) {
        super(drawingService, selectionHelper);
        this.initialVertices = new Array<Vec2>();
        this.translatedVertices = new Array<Vec2>();
    }

    private extractBounds(vertices: Vec2[]): Vec2[] {
        const LOWER = 0;
        const UPPER = 2;

        return vertices.slice(LOWER, UPPER);
    }

    private extractBulk(vertices: Vec2[]): Vec2[] {
        const START = 2;
        return vertices.slice(START);
    }

    initAllProperties(vertices: Vec2[]): void {
        this.initialVertices = this.extractBulk(vertices);
        super.initAllProperties(this.extractBounds(vertices));
        this.translateVerticesToCenter();
    }

    translateVertexToCenter(vertex: Vec2): Vec2 {
        const translation: Vec2 = {
            x: this.topLeftRelativeToMiddle.x - this.originalTopLeftOnBaseCanvas.x,
            y: this.topLeftRelativeToMiddle.y - this.originalTopLeftOnBaseCanvas.y,
        };
        return {
            x: vertex.x + translation.x,
            y: vertex.y + translation.y,
        };
    }

    translateVerticesToCenter(): void {
        this.translatedVertices = this.initialVertices.map((vertex) => this.translateVertexToCenter(vertex));
    }

    extractSelectionFromSource(sourceCanvas: HTMLCanvasElement): void {
        this.extract(sourceCanvas, this.selectionCtx, false);
    }

    extract(source: HTMLCanvasElement, destination: CanvasRenderingContext2D, fillItWhite: boolean): void {
        destination.save();
        destination.beginPath();
        this.translatedVertices.forEach((vertex) => {
            destination.lineTo(vertex.x, vertex.y);
        });
        destination.clip();

        destination.imageSmoothingEnabled = false;

        destination.drawImage(
            source,
            this.topLeftRelativeToMiddle.x - this.originalTopLeftOnBaseCanvas.x,
            this.topLeftRelativeToMiddle.y - this.originalTopLeftOnBaseCanvas.y,
        );

        destination.closePath();
        destination.restore();
    }

    whiteFillAtOriginalLocation(): void {
        const ctx = this.drawingService.baseCtx;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        this.initialVertices.forEach((vertex) => {
            ctx.lineTo(vertex.x, vertex.y);
        });
        ctx.fill();
        ctx.restore();
    }
}
