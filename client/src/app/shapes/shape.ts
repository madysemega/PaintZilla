import { ShapeProperty } from './properties/shape-property';

export abstract class Shape {
    constructor(public properties: ShapeProperty[]) {}
}
