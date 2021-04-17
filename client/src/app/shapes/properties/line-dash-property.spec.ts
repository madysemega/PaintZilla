import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { LineDashProperty } from './line-dash-property';

describe('LineDashProperty', () => {
    let property: LineDashProperty;

    const DASH_SIZE = 8;

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        property = new LineDashProperty([DASH_SIZE]);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it("when apply() is called, it should set the canvas's lineCap property to the value specified upon instantiation", () => {
        const setDashSpy = spyOn(ctxStub, 'setLineDash').and.callThrough();

        property.apply(ctxStub);
        expect(setDashSpy).toHaveBeenCalledWith([DASH_SIZE]);
    });

    it('clone should return an identical copy', () => {
        const clone = property.clone() as LineDashProperty;
        expect(clone.segments).toEqual(property.segments);
    });
});
