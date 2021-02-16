import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EraserService } from '@app/tools/services/tools/eraser-service';
import { LineService } from '@app/tools/services/tools/line.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { SidebarComponent } from './sidebar.component';

// tslint:disable:no-any
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolSelectorServiceStub: ToolSelectorService;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourToolService;
    let ellipseToolStub: EllipseService;
    let rectangleService: RectangleService;
    let lineServiceStub: LineService;
    let pencilStoolStub: PencilService;
    let drawingCreatorServiceSpy: jasmine.SpyObj<any>;
    let eraserStoolStub: EraserService;

    class RectangleServiceStub extends RectangleService {
        constructor(drawingService: DrawingService, colourService: ColourToolService) {
            super(drawingService, colourService);
        }
    }

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        colourServiceStub = new ColourToolService();
        pencilStoolStub = new PencilService(drawingStub, colourServiceStub);
        eraserStoolStub = new EraserService(drawingStub);
        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub);
        rectangleService = new RectangleServiceStub(drawingStub, colourServiceStub);
        drawingCreatorServiceSpy = jasmine.createSpyObj('DrawingCreatorService', ['createNewDrawing']);
        lineServiceStub = new LineService(drawingStub);
        toolSelectorServiceStub = new ToolSelectorService(pencilStoolStub, eraserStoolStub, ellipseToolStub, rectangleService, lineServiceStub);

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSelectorService, useValue: toolSelectorServiceStub },
                { provide: DrawingCreatorService, useValue: drawingCreatorServiceSpy },
            ],
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

    it('should return <Outil inconnu>', () => {
        const toolName = 'rectangle';
        component.selectTool('rectangle');
        expect(component.selectedToolName).toBe(toolName);
    });

    it('should return the display name of a tool when getDisplayName is called with a valid tool name', () => {
        const expectedDisplayName = '<Outil inconnu>';
        const obtainedDisplayName: string = component.getDisplayName('fdfs');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it('should return the display name of a tool when getDisplayName is called with a valid tool name', () => {
        const expectedDisplayName = 'Crayon';
        const obtainedDisplayName: string = component.getDisplayName('pencil');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it("should return '<Outil inconnu>' when asking for a keyboard shortcut of non-existing tool", () => {
        const expectedDisplayName = '<Outil inconnu>';
        const obtainedDisplayName: string = component.getKeyboardShortcut('invalid tool');
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

    it('createNewDrawing should call DrawingCreatorService createNewDrawing method', () => {
        component.createNewDrawing();
        expect(drawingCreatorServiceSpy.createNewDrawing).toHaveBeenCalled();
    });
});
