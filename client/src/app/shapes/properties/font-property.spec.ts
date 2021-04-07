import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { FontProperty } from './font-property';

describe('FontProperty', () => {
    let property: FontProperty;

    const FONT_SIZE = 32;
    const FONT_NAME = 'Arial';

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        property = new FontProperty(FONT_SIZE, FONT_NAME);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas rendering context's font property to the font specified upon instantiation", () => {
        property.apply(ctxStub);
        expect(ctxStub.font).toEqual(`${FONT_SIZE}px ${FONT_NAME}`);
    });

    it('clone should return an identical copy', () => {
        const clone = property.clone() as FontProperty;
        expect(clone.fontSize).toEqual(property.fontSize);
    });
});
