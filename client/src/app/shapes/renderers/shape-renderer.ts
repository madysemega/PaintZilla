import { Shape } from '@app/shapes/shape';

export abstract class ShapeRenderer<ShapeType extends Shape> {
    abstract draw(ctx: CanvasRenderingContext2D): void;

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.shape.properties.forEach((property) => property.apply(ctx));
        this.draw(ctx);
        ctx.restore();
    }

    constructor(protected shape: ShapeType) {}
}
