import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';

describe('ToolSelectorService', () => {
    let service: ToolSelectorService;
    let toolSelectorServiceStub: ToolSelectorService;
    let drawingStub: DrawingService;
    let ellipseStub: EllipseService;
    let rectangleStub: RectangleService;
    let pencilStub: PencilService;

    class ToolServiceStub extends RectangleService {
        constructor(drawingService: DrawingService, name: string) {
            super(drawingService);
            this.name = name;
        }

        select(): void {
            this.name = 'just-to-test';
        }
    }

    beforeEach(() => {
        drawingStub = new DrawingService();
        rectangleStub = new ToolServiceStub(drawingStub, 'rectangle');
        pencilStub = (new ToolServiceStub(drawingStub, 'Crayon') as unknown) as PencilService;
        ellipseStub = (new ToolServiceStub(drawingStub, 'ellipse') as unknown) as EllipseService;
        toolSelectorServiceStub = new ToolSelectorService(pencilStub, ellipseStub, rectangleStub);

        TestBed.configureTestingModule({
            providers: [{ provide: ToolSelectorService, useValue: toolSelectorServiceStub }],
        }).compileComponents();

        service = TestBed.inject(ToolSelectorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("should change tool to pencil when selectTool('pencil') is called", () => {
        service.selectTool('pencil');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('pencil') as MetaWrappedTool).tool);
    });

    it("should change tool to rect when selectTool('rectangle') is called", () => {
        service.selectTool('rectangle');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('rectangle') as MetaWrappedTool).tool);
    });

    it("should change tool to ellipse when selectTool('ellipse') is called", () => {
        service.selectTool('ellipse');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('ellipse') as MetaWrappedTool).tool);
    });

    it("fromKeyboardShortcut should map 'c' to 'pencil'", () => {
        const expectedToolName = 'pencil';
        const toolName = service.fromKeyboardShortcut('c');
        expect(toolName).toBe(expectedToolName);
    });

    it("fromKeyboardShortcut should map '1' to 'rectangle'", () => {
        const expectedToolName = 'rectangle';
        const toolName = service.fromKeyboardShortcut('1');
        expect(toolName).toBe(expectedToolName);
    });

    it("fromKeyboardShortcut should map '2' to 'ellipse'", () => {
        const expectedToolName = 'ellipse';
        const toolName = service.fromKeyboardShortcut('2');
        expect(toolName).toBe(expectedToolName);
    });

    it('should keep last selected tool when user tries to select a non-existent tool', () => {
        service.selectTool('pencil');
        service.selectTool('invalid tool');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('pencil') as MetaWrappedTool).tool);
    });

    it('should return the correct display name when calling getDisplayName with a valid tool name', () => {
        const displayName = service.getDisplayName('pencil');
        expect(displayName).toBe('Crayon');
    });

    it('should return undefined when calling getDisplayName with an invalid tool name', () => {
        const displayName = service.getDisplayName('invalid tool');
        expect(displayName).toBe(undefined);
    });
});
