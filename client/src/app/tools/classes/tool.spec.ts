import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { Tool } from './tool';

class ToolStub extends Tool {}

describe('Tool', () => {
    const CANVAS_X = 32;
    const CANVAS_Y = 12;
    const MOUSE_X = 3;
    const MOUSE_Y = 42;

    let toolStub: ToolStub;

    let historyServiceStub: HistoryService;
    let drawingService: DrawingService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;

    let fakeCanvas: HTMLCanvasElement;

    beforeEach(() => {
        fakeCanvas = {
            getBoundingClientRect: () => {
                return {
                    x: CANVAS_X,
                    y: CANVAS_Y,
                };
            },
        } as HTMLCanvasElement;
        
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        drawingService = new DrawingService(historyServiceStub);
        drawingService.canvas = fakeCanvas;

        toolStub = new ToolStub(drawingService);
    });

    it("getPositionFromMouse should return the mouse coordinate with the canvas's top-left most corner as the origin", () => {
        const mouseEvent: MouseEvent = { clientX: MOUSE_X, clientY: MOUSE_Y } as MouseEvent;
        const expectedCoordinate: Vec2 = { x: MOUSE_X - CANVAS_X, y: MOUSE_Y - CANVAS_Y };

        expect(toolStub.getPositionFromMouse(mouseEvent)).toEqual(expectedCoordinate);
    });
});
