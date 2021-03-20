import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from './shape';
import { VerticesShape } from './vertices-shape';

export class SprayShape extends VerticesShape {
    static readonly DEFAULT_RADIUS: number = 1;

    constructor(vertices: Vec2[], public radius: number = SprayShape.DEFAULT_RADIUS) {
        super(vertices);
    }

    clone(): Shape {
        const clonedVertices = new Array<Vec2>();

        this.vertices.forEach((vertex) => {
            if (vertex != undefined) {
                const clone = { x: vertex.x, y: vertex.y };
                clonedVertices.push(clone);
            }
        });

        return new SprayShape(clonedVertices, this.radius);
    }
}
