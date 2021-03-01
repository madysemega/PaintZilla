import { CanvasTestHelper } from "@app/app/classes/canvas-test-helper";
import { ShapeRenderer } from "@app/shapes/renderers/shape-renderer";
import { Shape } from "@app/shapes/shape";
import { UserActionRenderShape } from "./user-action-render-shape";

describe('UserActionRenderShape', () => {
    let action: UserActionRenderShape;
    let renderers: jasmine.SpyObj<ShapeRenderer<Shape>>[];

    let canvasTestHelper: CanvasTestHelper;
    let ctx: CanvasRenderingContext2D;

    const NB_RENDERERS_TO_GENERATE = 5;

    beforeEach(() => {
        renderers = new Array<jasmine.SpyObj<ShapeRenderer<Shape>>>();
        for(let i = 0; i < NB_RENDERERS_TO_GENERATE; ++i) {
            const renderer = jasmine.createSpyObj('ShapeRenderer', ['render']);
            renderers.push(renderer);
        }

        canvasTestHelper = new CanvasTestHelper();
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        action = new UserActionRenderShape(renderers, ctx);
    });

    it('apply should render all renderers once', () => {
        action.apply();
        renderers.forEach((renderer) => (expect(renderer.render).toHaveBeenCalledTimes(1)));
    });
});