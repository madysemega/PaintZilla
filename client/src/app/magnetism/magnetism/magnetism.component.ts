import { Component, HostListener } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
@Component({
    selector: 'app-magnetism',
    templateUrl: './magnetism.component.html',
    styleUrls: ['./magnetism.component.scss'],
})
export class MagnetismComponent {
    static readonly DEFAULT_MAX_OPACITY: number = 100;
    static readonly INCREMENT: number = 5;
    static readonly DECREMENT: number = 5;
    static readonly MIN_SIZE: number = 10;
    isActivated: boolean = false;
    isGridActivated: boolean = false;
    gridCellSize: number = 50;
    opacite: number = 100;
    constructor(
        public selectionManipulator: SelectionManipulatorService,
        public toolSelector: ToolSelectorService,
        public drawingService: DrawingService,
    ) {}

    toggleMagnetism(): void {
        this.isActivated = !this.isActivated;
        ((this.toolSelector.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.isMagnetismActivated = this.isActivated;
        ((this.toolSelector.getRegisteredTools().get('ellipse-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.isMagnetismActivated = this.isActivated;
    }
    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        const isPlus: boolean = event.key === '+';
        const isMoins: boolean = event.key === '-';
        const isEqual: boolean = event.key === '=';
        const isG: boolean = event.key === 'g';
        if (isPlus) {
            if (this.gridCellSize < MagnetismComponent.DEFAULT_MAX_OPACITY) {
                this.gridCellSizeChange(this.gridCellSize + MagnetismComponent.INCREMENT);
            }
        }
        if (isEqual) {
            if (this.gridCellSize < MagnetismComponent.DEFAULT_MAX_OPACITY) {
                this.gridCellSizeChange(this.gridCellSize + MagnetismComponent.INCREMENT);
            }
        }
        if (isMoins) {
            if (this.gridCellSize > MagnetismComponent.MIN_SIZE) {
                this.gridCellSizeChange(this.gridCellSize - MagnetismComponent.DECREMENT);
            }
        }
        if (isG) {
            this.toggleGrid();
        }
    }
    toggleGrid(): void {
        this.isGridActivated = !this.isGridActivated;
        ((this.toolSelector.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.isGridActive = this.isGridActivated;
        ((this.toolSelector.getRegisteredTools().get('ellipse-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.isGridActive = this.isGridActivated;
        if (this.isGridActivated === true) {
            this.drawGrid();
        } else if (this.isGridActivated === false) {
            this.deleteGrid();
        }
    }
    drawGrid(): void {
        for (let i = 0; i < this.drawingService.canvasSize.x; i = i + this.gridCellSize) {
            this.drawingService.gridCtx.moveTo(i, 0);
            if (this.opacite === MagnetismComponent.DEFAULT_MAX_OPACITY) {
                this.drawingService.gridCtx.strokeStyle = '#000000FF';
            } else {
                this.drawingService.gridCtx.strokeStyle = '#000000' + this.opacite;
            }
            this.drawingService.gridCtx.lineTo(i, this.drawingService.canvasSize.y);
        }
        for (let i = 0; i < this.drawingService.canvasSize.y; i = i + this.gridCellSize) {
            this.drawingService.gridCtx.moveTo(0, i);
            this.drawingService.gridCtx.lineTo(this.drawingService.canvasSize.x, i);
        }
        this.drawingService.gridCtx.stroke();
    }
    deleteGrid(): void {
        this.drawingService.gridCtx.beginPath();
        this.drawingService.gridCtx.clearRect(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);
        this.drawingService.gridCtx.stroke();
    }
    gridCellSizeChange(gridCellSize: number): void {
        this.gridCellSize = gridCellSize;
        ((this.toolSelector.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.gridCellSize = gridCellSize;
        ((this.toolSelector.getRegisteredTools().get('ellipse-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.gridCellSize = gridCellSize;
        if (this.isGridActivated === true) {
            this.deleteGrid();
            this.drawGrid();
        }
    }
    opaciteChange(opacite: number): void {
        this.opacite = opacite;
        if (this.isGridActivated === true) {
            this.deleteGrid();
            this.drawGrid();
        }
    }
    setGridAnchor(gridAnchor: number): void {
        ((this.toolSelector.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.gridMovementAnchor = gridAnchor;
        ((this.toolSelector.getRegisteredTools().get('ellipse-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.gridMovementAnchor = gridAnchor;
    }
}
