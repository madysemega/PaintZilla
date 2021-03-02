import { ICloneable } from '@app/app/classes/cloneable';

export abstract class ShapeProperty implements ICloneable<ShapeProperty> {
    abstract apply(ctx: CanvasRenderingContext2D): void;
    abstract clone(): ShapeProperty;
}
