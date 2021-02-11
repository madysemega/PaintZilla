import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { Shape } from '@app/shapes/shape';
import { ShapeRenderer } from './shape-renderer';

// tslint:disable:max-classes-per-file
// tslint:disable:no-empty

class MockShapeProperty extends ShapeProperty {
    hasBeenApplied: boolean;

    apply(ctx: CanvasRenderingContext2D): void {
        this.hasBeenApplied = true;
    }

    constructor() {
        super();
        this.hasBeenApplied = false;
    }
}

class StubShape extends Shape {}

class StubShapeRenderer extends ShapeRenderer<Shape> {
    draw(ctx: CanvasRenderingContext2D): void {}

    constructor(shape: Shape) {
        super(shape);
    }
}

describe('ShapeRenderer', () => {
    let shapeRenderer: StubShapeRenderer;
    let shape: StubShape;
    let properties: ShapeProperty[];

    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        shape = new StubShape(properties);
        shapeRenderer = new StubShapeRenderer(shape);

        canvasTestHelper = new CanvasTestHelper();
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should apply all properties when render() is called', () => {
        properties.push(new MockShapeProperty());
        properties.push(new MockShapeProperty());
        properties.push(new MockShapeProperty());
        shapeRenderer.render(ctxStub);
        properties.forEach((property) => {
            expect((property as MockShapeProperty).hasBeenApplied).toBeTruthy();
        });
    });
});
