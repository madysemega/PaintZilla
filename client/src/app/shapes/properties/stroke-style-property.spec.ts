import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { StrokeStyleProperty } from './stroke-style-property';

describe('StrokeStyleProperty', () => {
    let strokeStyleProperty: StrokeStyleProperty;

    const STROKE_STYLE: Colour = Colour.hexToRgb('424242');

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        strokeStyleProperty = new StrokeStyleProperty(STROKE_STYLE);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas rendering context's strokeStyle property to the colour specified upon instantiation", () => {
        strokeStyleProperty.apply(ctxStub);
        expect(ctxStub.strokeStyle).toBe(`#${STROKE_STYLE.toStringHex()}`);
    });
});
