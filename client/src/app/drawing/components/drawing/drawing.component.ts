import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { Tool } from '@app/tools/classes/tool';
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
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };
    wasResizing: boolean = false;
    constructor(private drawingService: DrawingService, public toolSelector: ToolSelectorService, public resizingService: ResizingService) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.canvasSize = this.canvasSize;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.resizingService.isResizing(event)) {
            this.resizingService.resizeCanvas(event);
        } else {
            this.toolSelector.getSelectedTool().onMouseMove(event);
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (!this.resizingService.isResizing(event)) {
            this.toolSelector.getSelectedTool().onMouseDown(event);
        }
    }

    @HostListener('document: mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.resizingService.isResizing(event)) {
            this.wasResizing = true;
            this.resizingService.disableResizer();
        } else {
            this.toolSelector.getSelectedTool().onMouseUp(event);
        }
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        if (!this.wasResizing) {
            this.toolSelector.getSelectedTool().onMouseClick(event);
        }
        this.wasResizing = false;
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        if (!this.resizingService.isResizing(event)) {
            this.toolSelector.getSelectedTool().onMouseDoubleClick(event);
        }
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        if (!this.resizingService.isResizing(event)) {
            this.toolSelector.getSelectedTool().onMouseLeave(event);
        }
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        if (!this.resizingService.isResizing(event)) {
            this.toolSelector.getSelectedTool().onMouseEnter(event);
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
        this.resizingService.activateResizer(button);
    }

    getCurrentTool(): Tool {
        return this.toolSelector.getSelectedTool();
    }
}
