import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { TextAlignmentProperty } from './text-alignment-property';

describe('TextAlignmentProperty', () => {
    let property: TextAlignmentProperty;

    const INITIAL_ALIGNMENT = 'left';

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        property = new TextAlignmentProperty(INITIAL_ALIGNMENT);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas rendering context's textAlign property to the value specified upon instantiation", () => {
        property.apply(ctxStub);
        expect(ctxStub.textAlign).toEqual(INITIAL_ALIGNMENT);
    });
});
