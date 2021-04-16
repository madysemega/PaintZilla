import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { Tool } from '@app/tools/classes/tool';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    @ViewChild('gridCanvas', { static: false }) gridCanvas: ElementRef<HTMLCanvasElement>;
    private gridCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
    isInCanvas: boolean;
    wasResizing: boolean;

    constructor(
        private drawingService: DrawingService,
        public toolSelector: ToolSelectorService,
        public resizingService: ResizingService,
        private drawingCreatorService: DrawingCreatorService,
    ) {
        this.wasResizing = false;
        this.drawingCreatorService.drawingRestored.subscribe(async () => {
            this.drawingService.initialSize = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
            this.drawingService.resetDrawingSurfaceDimensions();
            this.drawingService.resetDrawingSurfaceColour();
            const image = new Image();
            image.src = this.drawingService.currentDrawing;
            this.drawingService.initialImage = image;
            this.drawingService.onDrawingLoaded.emit();
        });
        this.drawingService.onDrawingSurfaceResize.subscribe((newDimensions: Vec2) => {
            this.canvasSize.x = newDimensions.x;
            this.canvasSize.y = newDimensions.y;

            this.drawingService.canvasResize.x = newDimensions.x;
            this.drawingService.canvasResize.y = newDimensions.y;

            this.resizingService.onCanvasResizeChange.emit({ x: newDimensions.x, y: newDimensions.y });
            this.resizingService.onCanvasSizeChange.emit({ x: newDimensions.x, y: newDimensions.y });
        });

        this.resizingService.onCanvasResizeChange.subscribe((dimensions: Vec2) => {
            this.setCanvasDimensions(this.baseCanvas.nativeElement, dimensions);
        });

        this.resizingService.onCanvasSizeChange.subscribe((dimensions: Vec2) => {
            this.setCanvasDimensions(this.previewCanvas.nativeElement, dimensions);
        });
    }

    setCanvasDimensions(canvas: HTMLCanvasElement, dimensions: Vec2): void {
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.gridCtx = this.gridCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.previewCanvas = this.previewCanvas.nativeElement;
        this.drawingService.gridCanvas = this.gridCanvas.nativeElement;
        this.drawingService.canvasSize = this.canvasSize;
        this.drawingService.initialSize.x = this.canvasSize.x;
        this.drawingService.initialSize.y = this.canvasSize.y;
        this.setCanvasDimensions(this.baseCanvas.nativeElement, this.canvasSize);
        this.setCanvasDimensions(this.previewCanvas.nativeElement, this.canvasSize);
        this.drawingService.restoreCanvasStyle();
    }

    @HostListener('document:wheel', ['$event'])
    onWheel(event: WheelEvent): void {
        if (this.isInCanvas) {
            this.toolSelector.getSelectedTool().onWheel(event);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.resizingService.isResizing()) {
            this.resizingService.resizeCanvas(event);
        } else {
            this.toolSelector.getSelectedTool().onMouseMove(event);
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (!this.resizingService.isResizing()) {
            this.toolSelector.getSelectedTool().onMouseDown(event);
        }
    }

    @HostListener('document: mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.resizingService.isResizing()) {
            this.wasResizing = true;
            this.resizingService.disableResizer();
            this.resizingService.finalizeResizingEvent();
        }
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        if (!this.wasResizing) {
            this.toolSelector.getSelectedTool().onMouseClick(event);
        }
        this.wasResizing = false;
        this.drawingService.isCanvasEmpty();
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        if (!this.resizingService.isResizing()) {
            this.toolSelector.getSelectedTool().onMouseDoubleClick(event);
        }
        this.drawingService.isCanvasEmpty();
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        if (!this.resizingService.isResizing()) {
            this.toolSelector.getSelectedTool().onMouseLeave(event);
            this.isInCanvas = false;
        }
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        if (!this.resizingService.isResizing()) {
            this.toolSelector.getSelectedTool().onMouseEnter(event);
            this.isInCanvas = true;
        }
    }

    get resizeWidth(): number {
        return this.resizingService.canvasResize.x;
    }

    get resizeHeight(): number {
        return this.resizingService.canvasResize.y;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    activateResizer(button: string): void {
        const creator: SelectionCreatorService | undefined = this.toolSelector.getActiveSelectionTool();
        if (creator != undefined) {
            (creator as SelectionCreatorService).stopManipulatingSelection();
        }
        this.resizingService.activateResizer(button);
    }

    disableResizer(): void {
        this.resizingService.disableResizer();
    }

    getCurrentTool(): Tool {
        return this.toolSelector.getSelectedTool();
    }
}
