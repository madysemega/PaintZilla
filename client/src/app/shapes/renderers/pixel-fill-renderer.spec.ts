import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { PixelShape } from '@app/shapes/pixel-shape';
import { FillStyleProperty } from '@app/shapes/properties/fill-style-property';
import { PixelFillRenderer } from '@app/shapes/renderers/pixel-fill-renderer';

export const WIDTH = 10;
export const HEIGHT = 10;
export const DEFAULT_COLOUR = new Colour();
describe('PixelFillRenderer', () => {
    let renderer: PixelFillRenderer;
    let shape: PixelShape;
    let properties: FillStyleProperty[];
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    beforeEach(() => {
        shape = new PixelShape([0]);
        properties = [new FillStyleProperty(DEFAULT_COLOUR)];
        renderer = new PixelFillRenderer(shape, properties, WIDTH, HEIGHT);
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
