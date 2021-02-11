import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { Tool } from './tool';

class ToolStub extends Tool {}

describe('Tool', () => {
    const CANVAS_X = 32;
    const CANVAS_Y = 12;
    const MOUSE_X = 3;
    const MOUSE_Y = 42;

    let toolStub: ToolStub;

    let drawingService: DrawingService;

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

        drawingService = new DrawingService();
        drawingService.canvas = fakeCanvas;

        toolStub = new ToolStub(drawingService);
    });

    it("getPositionFromMouse should return the mouse coordinate with the canvas's top-left most corner as the origin", () => {
        const mouseEvent: MouseEvent = { clientX: MOUSE_X, clientY: MOUSE_Y } as MouseEvent;
        const expectedCoordinate: Vec2 = { x: MOUSE_X - CANVAS_X, y: MOUSE_Y - CANVAS_Y };

        expect(toolStub.getPositionFromMouse(mouseEvent)).toEqual(expectedCoordinate);
    });
});
