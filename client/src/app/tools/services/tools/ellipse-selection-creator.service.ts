/*import { Injectable } from '@angular/core';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { Vec2 } from '@app/app/classes/vec2';
import { CursorType } from '@app/drawing/classes/cursor-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { ISelectableTool } from '@app/tools/classes/selectable-tool';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-manipulator.service'
import { IDeselectableTool } from '@app/tools/classes/deselectable-tool';
import { SelectionService } from '@app/tools/services/selection/selection.service';
import { EllipseSelectionHandlerService } from '@app/tools/services/selection/ellipse-selection-handler-service';
import { SelectionCreatorService } from '@app/tools/services/selection*'

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionCreatorService extends SelectionCreatorService {
    private readonly MINIMUM_SELECTION_WIDTH: number = 5;
    private startPoint: Vec2 = { x: 0, y: 0 };
    private lastMousePosition: Vec2 = { x: 0, y: 0 };
    private isShiftDown: boolean;

    constructor(drawingService: DrawingService, private selectionManipulatorService: SelectionManipulatorService, private selectionHandler: EllipseSelectionHandlerService, private selectionService: SelectionService) {
        super(drawingService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse-selection'; 
    }

    onMouseDown(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;

        this.registerMousePosition(mousePosition, true);

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onMouseDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.adjustPositionToStayInCanvas(mousePosition);

        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onMouseMove(event);
            return;
        }

        if (this.mouseDown) {
            this.registerMousePosition(mousePosition, false);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(mousePosition);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.adjustPositionToStayInCanvas(mousePosition);
        
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onMouseUp(event);
            this.mouseDown = false;
            return;
        }

        if (this.mouseDown && this.startPointIsFarEnoughFrom(mousePosition)) {
            this.registerMousePosition(mousePosition, false);
            this.createSelection(this.startPoint, mousePosition);
            this.drawSelectionOutline(mousePosition);
            this.resetProperties();
        }

        this.mouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onKeyDown(event);
            return;
        }

        if (event.key === 'Shift') {
            this.isShiftDown = true;
        }

        if (this.isShiftDown && this.mouseDown ) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(this.lastMousePosition);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.onKeyUp(event);
            return;
        }

        if (event.key === 'Shift') {
            this.isShiftDown = false;
        }

        if (this.isShiftDown && this.mouseDown ) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawSelectionOutline(this.lastMousePosition);
        }
    }

    onToolSelect(): void {
        this.drawingService.setCursorType(CursorType.CROSSHAIR);
    }

    onToolDeselect(): void {
        this.resetProperties();
        this.stopManipulatingSelection();
    }

    createSelection(startPoint: Vec2, endPoint: Vec2): void {
        if (this.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(startPoint, endPoint);
        }

        this.convertToTopLeftAndBottomRight(startPoint, endPoint);

        //////////////////
        let center: Vec2 = { x: 0, y: 0 }, radii: Vec2 = { x: 0, y: 0 };
        this.selectionService.getEllipseParam(startPoint, endPoint, center, radii);
        this.selectionHandler.select(this.drawingService.canvas, startPoint, center, radii);
        //////////////////

        this.selectionService.setIsSelectionBeingManipulated(true);
        this.selectionManipulatorService.initialize(startPoint, endPoint);
    }

    stopManipulatingSelection() {
        if (this.isSelectionBeingManipulated()) {
            this.selectionManipulatorService.stopManipulation(true);
            this.selectionService.setIsSelectionBeingManipulated(false);
            return;
        }
        this.selectionManipulatorService.stopManipulation(false);
    }

    ///////////
    drawSelectionOutline(endPoint: Vec2) {
        let center: Vec2 = { x: 0, y: 0 }, radii = { x: 0, y: 0 };

        if (this.isShiftDown) {
            endPoint = this.selectionService.getSquareAjustedPerimeter(this.startPoint, endPoint);
        }

        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);
        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, endPoint, this.isShiftDown);
    }
    ////////////

    convertToTopLeftAndBottomRight(startPoint: Vec2, endPoint: Vec2) {
        let startPointCopy: Vec2 = { x: this.startPoint.x, y: this.startPoint.y };

        if (startPoint.x > endPoint.x) {
            startPoint.x = endPoint.x;
            endPoint.x = startPointCopy.x;
        }
        if (startPoint.y > endPoint.y) {
            startPoint.y = endPoint.y;
            endPoint.y = startPointCopy.y;
        }
    }

    registerMousePosition(mousePos: Vec2, isStartPoint: boolean): void {
        this.lastMousePosition = mousePos

        if (isStartPoint) {
            this.mouseDownCoord = mousePos;
            this.startPoint = mousePos;
        }
    }

    startPointIsFarEnoughFrom(mousePos: Vec2): boolean {
        return Math.sqrt(Math.pow(this.startPoint.x - mousePos.x, 2) + Math.pow(this.startPoint.y - mousePos.y, 2)) > this.MINIMUM_SELECTION_WIDTH;
    }

    isSelectionBeingManipulated(): boolean {
        return this.selectionService.isSelectionBeingManipulated.getValue();
    }

    adjustPositionToStayInCanvas(mousePos: Vec2): void {
        let canvasSize: Vec2 = this.drawingService.canvasSize;
        if (mousePos.x < 0) {
            mousePos.x = 0;
        }
        if (mousePos.x > canvasSize.x) {
            mousePos.x = canvasSize.x;
        }
        if (mousePos.y > canvasSize.y) {
            mousePos.y = canvasSize.y;
        }
        if (mousePos.y < 0) {
            mousePos.y = 0;
        }
    }

    resetProperties(){
        this.startPoint = { x: 0, y: 0 };
        this.lastMousePosition = { x: 0, y: 0 };
        this.mouseDown = false;
        this.isShiftDown = false;
    }
}*/


import { ShapeType } from '@app/app/classes/shape-type';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse-selection-manipulator.service'
import { SelectionService } from '@app/tools/services/selection/selection.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-creator.service'
import { EllipseSelectionHandlerService } from '@app/tools/services/selection/ellipse-selection-handler-service';
import { Vec2 } from '@app/app/classes/vec2';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionCreatorService extends SelectionCreatorService {

    constructor(drawingService: DrawingService, selectionManipulatorService: EllipseSelectionManipulatorService, selectionHandler: EllipseSelectionHandlerService, selectionService: SelectionService) {
        super(drawingService, selectionManipulatorService, selectionHandler, selectionService);
        this.shapeType = ShapeType.Contoured;
        this.key = 'ellipse-selection';
    }

    drawSelectionOutline(endPoint: Vec2): void {
        let center: Vec2 = { x: 0, y: 0 }, radii = { x: 0, y: 0 };
        if(this.isShiftDown){
            endPoint = this.selectionService.getSquareAjustedPerimeter(this.startPoint, endPoint);
        }
        this.selectionService.getEllipseParam(this.startPoint, endPoint, center, radii);
        this.selectionService.drawSelectionEllipse(center, radii);
        this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.startPoint, endPoint, this.isShiftDown);
    }
}

