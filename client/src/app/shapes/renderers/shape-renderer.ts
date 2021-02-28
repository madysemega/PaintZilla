import { ICloneable } from '@app/app/classes/cloneable';
import { ShapeProperty } from '@app/shapes/properties/shape-property';
import { Shape } from '@app/shapes/shape';

export abstract class ShapeRenderer<ShapeType extends Shape> implements ICloneable<ShapeRenderer<ShapeType>> {
    abstract draw(ctx: CanvasRenderingContext2D): void;

    constructor(protected shape: ShapeType, private properties: ShapeProperty[]) {}
    
    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.properties.forEach((property) => property.apply(ctx));
        this.draw(ctx);
        ctx.restore();
    }

    protected getShapeCopy(): ShapeType {
        return this.shape.clone() as ShapeType;
    }

    protected getPropertiesCopy(): ShapeProperty[] {
        let clonedProperties = new Array<ShapeProperty>();

        this.properties.forEach((property) => {
            const clone = property.clone();
            clonedProperties.push(clone);
        });
        
        return clonedProperties;
    }

    abstract clone(): ShapeRenderer<ShapeType>;
}
