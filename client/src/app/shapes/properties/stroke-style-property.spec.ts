import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { StrokeStyleProperty } from './stroke-style-property';

describe('StrokeStyleProperty', () => {
    let strokeStyleProperty: StrokeStyleProperty;

    const strokeStyle = '#424242';

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        strokeStyleProperty = new StrokeStyleProperty(strokeStyle);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas rendering context's strokeStyle property to the colour specified upon instantiation", () => {
        strokeStyleProperty.apply(ctxStub);
        expect(ctxStub.strokeStyle).toBe(strokeStyle);
    });
});
