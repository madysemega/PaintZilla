import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import * as Constants from '@app/shapes/properties/stroke-width-property/stroke-width-constants';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property/stroke-width-property';

describe('StrokeWidthProperty', () => {
    let strokeWidthProperty: StrokeWidthProperty;

    const strokeWidth = 3;

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        strokeWidthProperty = new StrokeWidthProperty(strokeWidth);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas rendering context's lineWidth property to the width specified upon instantiation", () => {
        strokeWidthProperty.apply(ctxStub);
        expect(ctxStub.lineWidth).toBe(strokeWidth);
    });

    it('if instantiated without any width given, width should be default', () => {
        strokeWidthProperty = new StrokeWidthProperty();
        expect(strokeWidthProperty.strokeWidth).toEqual(Constants.DEFAULT_STROKE_WIDTH);
    });
});
