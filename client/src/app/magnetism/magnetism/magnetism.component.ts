import { Component } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import * as Constants from '@app/magnetism/magnetism.constant';
import { MagnetismService } from '@app/magnetism/magnetism.service';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';
import { GridMovementAnchor } from '@app/tools/services/selection/selection-utils';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseSelectionCreatorService } from '@app/tools/services/tools/ellipse-selection-creator.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
@Component({
    selector: 'app-magnetism',
    templateUrl: './magnetism.component.html',
    styleUrls: ['./magnetism.component.scss'],
})
export class MagnetismComponent {
    gridMovementAnchor: typeof GridMovementAnchor = GridMovementAnchor;
    isMagnetismActivated: boolean = false;
    tester: number = 0;
    delete: boolean = false;
    increment: boolean = false;
    decrement: boolean = false;
    draw: boolean = false;
    isGridActivated: boolean = false;
    gridCellSize: number = 50;
    opacite: number = 100;
    constructor(
        public selectionManipulator: SelectionManipulatorService,
        public toolSelector: ToolSelectorService,
        public magnetismService: MagnetismService,
        public drawingService: DrawingService,
    ) {
        this.magnetismService.isGrid.subscribe((value) => {
            if (this.isGridActivated !== value) {
                this.isGridActivated = value;
                this.toggleGrid();
            }
        });
        this.magnetismService.isActivated.subscribe((value) => {
            this.isMagnetismActivated = value;
            this.notifyManipulators();
        });
        this.magnetismService.isIncrement.subscribe(() => {
            this.incrementGrid();
        });
        this.magnetismService.isDecrement.subscribe(() => {
            this.decrementGrid();
        });
    }
    notifyManipulators(): void {
        ((this.toolSelector.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.isMagnetismActivated = this.isMagnetismActivated;
        ((this.toolSelector.getRegisteredTools().get('ellipse-selection') as MetaWrappedTool)
            .tool as RectangleSelectionCreatorService).selectionManipulator.isMagnetismActivated = this.isMagnetismActivated;
    }
    toggleGrid(): void {
        if (this.isGridActivated === true) {
            this.drawGrid();
        } else {
            this.deleteGrid();
        }
    }
    incrementGrid(): void {
        if (this.gridCellSize < Constants.DEFAULT_MAX_OPACITY_AND_SIZE) {
            this.gridCellSizeChange(this.gridCellSize + Constants.INCREMENT);
        }
        this.increment = true;
    }
    decrementGrid(): void {
        if (this.gridCellSize > Constants.MIN_SIZE) {
            this.gridCellSizeChange(this.gridCellSize - Constants.DECREMENT);
        }
        this.decrement = true;
    }
    drawGrid(): void {
        for (let i = 0; i < this.drawingService.canvasSize.x; i = i + this.gridCellSize) {
            this.drawingService.gridCtx.moveTo(i, 0);
            if (this.opacite === Constants.DEFAULT_MAX_OPACITY_AND_SIZE) {
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
        this.draw = true;
    }
    notifyGrid(): void{
        this.magnetismService.toggleGrid();
    }
    deleteGrid(): void {
        this.drawingService.gridCtx.beginPath();
        this.drawingService.gridCtx.clearRect(0, 0, this.drawingService.canvasSize.x, this.drawingService.canvasSize.y);
        this.drawingService.gridCtx.stroke();
        this.delete = true;
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
            .tool as EllipseSelectionCreatorService).selectionManipulator.gridMovementAnchor = gridAnchor;
    }

    getCurrentGridAnchor(): GridMovementAnchor {
        const invalid = -1;
        if (!this.isMagnetismActivated) {
            return invalid;
        }
        return ((this.toolSelector.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool).tool as RectangleSelectionCreatorService)
            .selectionManipulator.gridMovementAnchor;
    }
}
