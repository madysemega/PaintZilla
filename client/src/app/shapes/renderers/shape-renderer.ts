import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { Shape } from '@app/shapes/shape';

export abstract class ShapeRenderer<ShapeType extends Shape> {
    abstract draw(ctx: CanvasRenderingContext2D): void;

    constructor(protected shape: ShapeType, private properties: ShapeProperty[]) {}

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.properties.forEach((property) => property.apply(ctx));
        this.draw(ctx);
        ctx.restore();
    }

    
}
