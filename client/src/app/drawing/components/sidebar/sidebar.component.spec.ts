import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service.service';
import { EraserService } from '@app/tools/services/tools/eraser-service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { SidebarComponent } from './sidebar.component';

// tslint:disable:no-any
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let keyboard1Event: KeyboardEvent;
    let keyboardShiftEvent: KeyboardEvent;
    let toolSelectorServiceStub: ToolSelectorService;
    let drawingStub: DrawingService;
    let ellipseToolStub: EllipseService;
    let rectangleService: RectangleService;
    let pencilStoolStub: PencilService;
    let eraserStoolStub: EraserService;

    keyboard1Event = {
        key: '1',
    } as KeyboardEvent;

    keyboardShiftEvent = {
        key: 'Shift',
    } as KeyboardEvent;

    class RectangleServiceStub extends RectangleService {
        constructor(drawingService: DrawingService) {
            super(drawingService);
        }
    }

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        pencilStoolStub = new PencilService(drawingStub);
        eraserStoolStub = new EraserService(drawingStub);
        ellipseToolStub = new EllipseService(drawingStub);
        rectangleService = new RectangleServiceStub(drawingStub);
        toolSelectorServiceStub = new ToolSelectorService(pencilStoolStub, eraserStoolStub, ellipseToolStub, rectangleService);

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [{ provide: ToolSelectorService, useValue: toolSelectorServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set selectedToolName to new toolName when calling selectTool', () => {
        const toolName = 'rectangle';
        component.selectTool('rectangle');
        expect(component.selectedToolName).toBe(toolName);
    });

    it('should set selectedToolName to new toolName when pressing a key corresponding to a tool', () => {
        const toolName = 'rectangle';
        component.onKeyUp(keyboard1Event);
        expect(component.selectedToolName).toEqual(toolName);
    });

    it('should not set selectedToolName to new toolName when pressing a key not corresponding to a tool', () => {
        const toolName = component.selectedToolName;
        component.onKeyDown(keyboardShiftEvent);
        expect(component.selectedToolName).toBe(toolName);
    });

    /*it('should call onMouseUp on the currently selected tool of the tool selector', () => {
        component.onKeyUp(keyboard1Event);
        expect(toolSelectorSpy.getSelectedTool).toHaveBeenCalled();
    });*/

    it('should return the display name of a tool when getDisplayName is called with a valid tool name', () => {
        const expectedDisplayName = 'Crayon';
        const obtainedDisplayName: string = component.getDisplayName('pencil');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it("should return '<Outil inconnu>' when getDisplayName is called with an invalid tool name", () => {
        const expectedDisplayName = '<Outil inconnu>';
        const obtainedDisplayName: string = component.getDisplayName('invalid tool');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it('getIconName(toolName) should return the correct icon name if given toolName is valid', () => {
        const expectedIconName = 'pencil';
        const obtainedIconName: string = component.getIconName('pencil');
        expect(obtainedIconName).toBe(expectedIconName);
    });

    it("getIconName(toolName) should return 'unknown' if given toolName is invalid", () => {
        const expectedIconName = 'unknown';
        const obtainedIconName: string = component.getIconName('invalid tool');
        expect(obtainedIconName).toBe(expectedIconName);
    });
});
