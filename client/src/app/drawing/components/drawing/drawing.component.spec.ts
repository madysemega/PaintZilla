import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Constants from '@app/drawing/constants/drawing-constants';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { HistoryService } from '@app/history/service/history.service';
import { MaterialModule } from '@app/material.module';
import { Tool } from '@app/tools/classes/tool';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseSelectionCreatorService } from '@app/tools/services/tools/ellipse-selection-creator.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}

// tslint:disable:no-any
describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let historyServiceStub: jasmine.SpyObj<HistoryService>;
    let drawingStub: DrawingService;
    let resizingServiceStub: ResizingService;
    let toolSelectorStub: jasmine.SpyObj<any>;
    let creatorStub: SelectionCreatorService;

    beforeEach(async(() => {
        toolSelectorStub = jasmine.createSpyObj('ToolSelector', ['selectTool', 'getSelectedTool', 'fromKeyboardShortcut', 'getActiveSelectionTool']);
        historyServiceStub = jasmine.createSpyObj('HistoryService', ['do', 'undo', 'redo', 'onUndo']);
        historyServiceStub.do.and.stub();
        historyServiceStub.undo.and.stub();
        historyServiceStub.redo.and.stub();
        historyServiceStub.onUndo.and.stub();
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService(historyServiceStub);
        resizingServiceStub = new ResizingService(drawingStub, historyServiceStub);
        toolSelectorStub.getSelectedTool.and.returnValue(toolStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule],
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: ResizingService, useValue: resizingServiceStub },
                { provide: ToolSelectorService, useValue: toolSelectorStub },
                { provide: MatDialogRef, useValue: {} },
                { provide: DrawingCreatorService },
            ],
        }).compileComponents();

        creatorStub = TestBed.inject(EllipseSelectionCreatorService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        component.toolSelector.selectedTool = { displayName: 'Rectangle', icon: 'rectangle-contoured', keyboardShortcut: '1', tool: toolStub };
        resizingServiceStub.rightDownResizerEnabled = false;
        resizingServiceStub.rightResizerEnabled = false;
        resizingServiceStub.downResizerEnabled = false;
        component.wasResizing = false;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("onMouseMove(): should call the resizingService's resizeCanvas method when receiving a mouse move event and the canvas is resizing", () => {
        const mouseEvent: MouseEvent = { clientX: 0, clientY: 0 } as MouseEvent;
        spyOn(resizingServiceStub, 'isResizing').and.returnValue(true);
        spyOn(resizingServiceStub, 'restorePreviewImageData').and.returnValue();
        const resizeCanvasStub = spyOn(resizingServiceStub, 'resizeCanvas').and.stub();
        component.onMouseMove(mouseEvent);
        expect(resizeCanvasStub).toHaveBeenCalled();
        expect(resizeCanvasStub).toHaveBeenCalledWith(mouseEvent);
    });

    it("onMouseMove(): should call the tool's mouse move when receiving a mouse move event and canvas is not resizing", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("onMouseDown(): should call the tool's mouse down when receiving a mouse down event and canvas is not resizing", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("onMouseDown(): should not call the tool's mouse down when receving a mouse down event and the canvas is resizing", () => {
        const event = {} as MouseEvent;
        spyOn(resizingServiceStub, 'isResizing').and.returnValue(true);
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).not.toHaveBeenCalled();
        expect(mouseEventSpy).not.toHaveBeenCalledWith(event);
    });

    it("onMouseUp(): should call resizingService's disableResizer method and wasResizing should be true when receiving a mouse up event \
    and canvas is resizing ", () => {
        const event = {} as MouseEvent;
        spyOn(resizingServiceStub, 'isResizing').and.returnValue(true);
        spyOn(resizingServiceStub, 'restoreBaseImageData').and.returnValue();
        spyOn(resizingServiceStub, 'updateCanvasSize').and.returnValue();
        const disableResizerStub = spyOn(resizingServiceStub, 'disableResizer').and.stub();
        component.onMouseUp(event);
        expect(disableResizerStub).toHaveBeenCalled();
        expect(component.wasResizing).toEqual(true);
    });

    it("onMouseUp(): should not call resizingService's disableResizer method and wasResizing should be false when receiving a mouse up event \
    and canvas is not resizing", () => {
        const event = {} as MouseEvent;
        spyOn(resizingServiceStub, 'isResizing').and.returnValue(false);
        spyOn(resizingServiceStub, 'restoreBaseImageData').and.returnValue();
        spyOn(resizingServiceStub, 'updateCanvasSize').and.returnValue();
        const disableResizerStub = spyOn(resizingServiceStub, 'disableResizer').and.stub();
        component.onMouseUp(event);
        expect(disableResizerStub).not.toHaveBeenCalled();
        expect(component.wasResizing).toEqual(false);
    });

    it("onMouseClick(): should call the tool's mouse click when receiving a mouse click event and canvas \
    is not resizing and wasResizing should be reset to false", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseClick').and.callThrough();
        component.onMouseClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(component.wasResizing).toEqual(false);
    });

    it("onMouseClick(): should not call the tool's mouse click when receiving a mouse click event and canvas \
    is resizing and wasResizing should be reset to false", () => {
        const event = {} as MouseEvent;
        component.wasResizing = true;
        const mouseEventSpy = spyOn(toolStub, 'onMouseClick').and.callThrough();
        component.onMouseClick(event);
        expect(mouseEventSpy).not.toHaveBeenCalled();
        expect(mouseEventSpy).not.toHaveBeenCalledWith(event);
        expect(component.wasResizing).toEqual(false);
    });

    it("onMouseDoubleClick(): should call the tool's mouse doubleclick when receiving a mouse doubleclick event and canvas is not resizing", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDoubleClick').and.callThrough();
        component.onMouseDoubleClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("onMouseDoubleClick(): should not call the tool's mouse doubleclick when receiving a mouse doubleclick event and canvas is resizing", () => {
        const event = {} as MouseEvent;
        spyOn(resizingServiceStub, 'isResizing').and.returnValue(true);
        const mouseEventSpy = spyOn(toolStub, 'onMouseDoubleClick').and.callThrough();
        component.onMouseDoubleClick(event);
        expect(mouseEventSpy).not.toHaveBeenCalled();
        expect(mouseEventSpy).not.toHaveBeenCalledWith(event);
    });

    it("onMouseLeave(): should call the tool's mouse leave when receiving a mouse leave event and canvas is not resizing", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseLeave').and.callThrough();
        component.onMouseLeave(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("onMouseLeave(): should not call the tool's mouse leave when receiving a mouse leave event and canvas is resizing", () => {
        const event = {} as MouseEvent;
        spyOn(resizingServiceStub, 'isResizing').and.returnValue(true);
        const mouseEventSpy = spyOn(toolStub, 'onMouseLeave').and.callThrough();
        component.onMouseLeave(event);
        expect(mouseEventSpy).not.toHaveBeenCalled();
        expect(mouseEventSpy).not.toHaveBeenCalledWith(event);
    });

    it("onMouseEnter(): should call the tool's mouse enter when receiving a mouse enter event and canvas is not resizing", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseEnter').and.callThrough();
        component.onMouseEnter(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("onMouseEnter(): should not call the tool's mouse enter when receiving a mouse enter event and canvas is resizing", () => {
        const event = {} as MouseEvent;
        spyOn(resizingServiceStub, 'isResizing').and.returnValue(true);
        const mouseEventSpy = spyOn(toolStub, 'onMouseEnter').and.callThrough();
        component.onMouseEnter(event);
        expect(mouseEventSpy).not.toHaveBeenCalled();
        expect(mouseEventSpy).not.toHaveBeenCalledWith(event);
    });

    it('width() and height(): should have a default resize WIDTH and HEIGHT', () => {
        const width = component.resizeWidth;
        const height = component.resizeHeight;
        expect(width).toEqual(Constants.DEFAULT_WIDTH);
        expect(height).toEqual(Constants.DEFAULT_HEIGHT);
    });

    it('resizeWidth() and resizeHeight(): should have a default WIDTH and HEIGHT', () => {
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(Constants.DEFAULT_HEIGHT);
        expect(width).toEqual(Constants.DEFAULT_WIDTH);
    });

    it("activateResizer(): should call resizerService's activateResizer method", () => {
        const argument = '';
        spyOn(resizingServiceStub, 'saveCurrentImage').and.returnValue();
        const resizerSpy = spyOn(resizingServiceStub, 'activateResizer').and.callThrough();
        component.activateResizer(argument);
        expect(resizerSpy).toHaveBeenCalled();
        expect(resizerSpy).toHaveBeenCalledWith(argument);
    });

    it('activateResizer(): should tell the active selection tool to stop selection', () => {
        spyOn(resizingServiceStub, 'saveCurrentImage').and.returnValue();
        toolSelectorStub.getActiveSelectionTool.and.returnValue(creatorStub);
        const argument = '';
        const stopSelectionSpy: jasmine.Spy<any> = spyOn(creatorStub, 'stopManipulatingSelection').and.callThrough();
        component.activateResizer(argument);
        expect(stopSelectionSpy).toHaveBeenCalled();
    });

    it("disableResizer(): should call resizerService's disable resizer method", () => {
        const disableResizerStub = spyOn(resizingServiceStub, 'disableResizer').and.stub();
        component.disableResizer();
        expect(disableResizerStub).toHaveBeenCalled();
    });

    it('getCurrentTool(): should get stubTool', () => {
        const currentTool = component.getCurrentTool();
        expect(currentTool).toEqual(toolStub);
    });

    it('when the drawing surface is resized, in the drawing service, it should be reflected in the drawing component', () => {
        const WIDTH = 420;
        const HEIGHT = 332;

        drawingStub.resizeDrawingSurface(WIDTH, HEIGHT);

        // tslint:disable-next-line: no-string-literal
        expect(component['canvasSize']).toEqual({ x: WIDTH, y: HEIGHT });
        expect(drawingStub.canvasResize).toEqual({ x: WIDTH, y: HEIGHT });
    });

    it('When drawing is restored from creator service, attributes should be reset to default', () => {
        const drawingCreatorService = fixture.debugElement.injector.get(DrawingCreatorService);

        drawingCreatorService.drawingRestored.subscribe(() => {
            const EXPECTED_WIDTH = Math.floor(Constants.DEFAULT_WIDTH);
            const EXPECTED_HEIGHT = Math.floor(Constants.DEFAULT_HEIGHT);

            expect(Math.floor(resizingServiceStub.canvasResize.x)).toEqual(EXPECTED_WIDTH);
            expect(Math.floor(resizingServiceStub.canvasResize.y)).toEqual(EXPECTED_HEIGHT);

            expect(Math.floor(drawingStub.canvas.width)).toEqual(EXPECTED_WIDTH);
            expect(Math.floor(drawingStub.canvas.height)).toEqual(EXPECTED_HEIGHT);

            expect(Math.floor(drawingStub.previewCanvas.width)).toEqual(EXPECTED_WIDTH);
            expect(Math.floor(drawingStub.previewCanvas.height)).toEqual(EXPECTED_HEIGHT);
        });

        drawingCreatorService.drawingRestored.emit();
    });
});
