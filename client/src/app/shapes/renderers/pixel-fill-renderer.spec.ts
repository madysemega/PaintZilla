import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { PixelShape } from '@app/shapes/pixel-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { PixelFillRenderer } from '@app/shapes/renderers/pixel-fill-renderer';
import * as Constants from '@app/tools/services/paint-bucket/paint-bucket.constants';
describe('PixelFillRenderer', () => {
    let renderer: PixelFillRenderer;
    let shape: PixelShape;
    let properties: FillStyleProperty[];
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    beforeEach(() => {
        shape = new PixelShape([0]);
        properties = [new FillStyleProperty(Constants.BLACK)];
        renderer = new PixelFillRenderer(shape, properties, Constants.WIDTH, Constants.HEIGHT);
        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create', () => {
        expect(renderer).toBeTruthy();
    });

    it('draw(): should call putImageData to place final image on canvas', () => {
        spyOn(ctxStub, 'getImageData').and.callThrough();
        const putStub = spyOn(ctxStub, 'putImageData').and.stub();
        renderer.draw(ctxStub);
        expect(putStub).toHaveBeenCalled();
    });

    it('should return renderer with same properties as original', () => {
        const clone = renderer.clone() as PixelFillRenderer;
        expect(clone.fillColour).toEqual(renderer.fillColour);
        expect(clone.height).toEqual(renderer.height);
        expect(clone.width).toEqual(renderer.width);
    });
});
