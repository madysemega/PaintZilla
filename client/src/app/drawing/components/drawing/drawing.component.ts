import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { Tool } from '@app/tools/classes/tool';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import * as canvasAttributes from '../../constants/canvas-attributes';
import { DrawingSurfaceResizingService } from '../../services/drawing-service/drawing-surface-resizing.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    // @ViewChild('container', { static: false }) container: ElementRef<HTMLDivElement>;
    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: canvasAttributes.DEFAULT_WIDTH, y: canvasAttributes.DEFAULT_HEIGHT };
    private isResizing: boolean = false;
    private image: ImageData;
    constructor(
        private drawingService: DrawingService,
        public toolSelector: ToolSelectorService,
        private drawingSurfaceResizingService: DrawingSurfaceResizingService,
    ) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isResizing) {
            this.drawingSurfaceResizingService.resizingCanvas(event);
            this.previewCtx.putImageData(this.image, 0, 0);
            this.baseCanvas.nativeElement.style.border = 'medium dotted black';
        } else {
            this.toolSelector.getSelectedTool().onMouseMove(event);
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.drawingSurfaceResizingService.isResizing(event)) {
            this.isResizing = true;
        } else {
            this.toolSelector.getSelectedTool().onMouseDown(event);
        }
    }

    @HostListener('document: mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.isResizing) {
            this.isResizing = false;
            this.canvasSize.x = this.drawingSurfaceResizingService.resizeCanvasX();
            this.canvasSize.y = this.drawingSurfaceResizingService.resizeCanvasY();
            this.baseCtx.putImageData(this.image, 0, 0);
            this.baseCanvas.nativeElement.style.border = 'medium none black';
            this.drawingSurfaceResizingService.disableResizer();
        } else {
            this.toolSelector.getSelectedTool().onMouseUp(event);
        }
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.toolSelector.getSelectedTool().onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.toolSelector.getSelectedTool().onMouseEnter(event);
    }

    get resizeWidth(): number {
        return this.drawingSurfaceResizingService.canvasResize.x;
    }

    get resizeHeight(): number {
        return this.drawingSurfaceResizingService.canvasResize.y;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    activateResizer(button: string): void {
        this.image = this.baseCtx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y);
        this.drawingSurfaceResizingService.activateResizer(button);
    }

    getCurrentTool(): Tool {
        return this.toolSelector.getSelectedTool();
    }
}
