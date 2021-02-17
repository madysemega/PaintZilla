import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { LineCapProperty } from './line-cap-property';

describe('LineCapProperty', () => {
    let lineCapProperty: LineCapProperty;

    const LINE_CAP: CanvasLineCap = 'round';

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        lineCapProperty = new LineCapProperty(LINE_CAP);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas's lineCap property to the value specified upon instantiation", () => {
        lineCapProperty.apply(ctxStub);
        expect(ctxStub.lineCap).toEqual(LINE_CAP);
    });
});
