import { ICloneable } from "@app/app/classes/cloneable";

export abstract class Shape implements ICloneable<Shape> {
    abstract clone(): Shape;
}
