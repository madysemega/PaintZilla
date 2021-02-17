import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { LineJoinProperty } from './line-join-property';

describe('LineJoinProperty', () => {
    let lineJoinProperty: LineJoinProperty;

    const LINE_JOIN: CanvasLineJoin = 'round';

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        lineJoinProperty = new LineJoinProperty(LINE_JOIN);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas's lineJoin property to the value specified upon instantiation", () => {
        lineJoinProperty.apply(ctxStub);
        expect(ctxStub.lineJoin).toEqual(LINE_JOIN);
    });
});
