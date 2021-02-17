import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { FillStyleProperty } from './fill-style-property';

describe('FillStyleProperty', () => {
    let fillStyleProperty: FillStyleProperty;

    const FILL_STYLE = '#424242';

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        fillStyleProperty = new FillStyleProperty(FILL_STYLE);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas rendering context's fillStyle property to the colour specified upon instantiation", () => {
        fillStyleProperty.apply(ctxStub);
        expect(ctxStub.fillStyle).toEqual(FILL_STYLE);
    });
});
