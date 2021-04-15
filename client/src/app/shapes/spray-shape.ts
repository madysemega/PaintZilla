import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from './shape';
import { VerticesShape } from './vertices-shape';

export class SprayShape extends VerticesShape {
    constructor(vertices: Vec2[], public radius: number = 1) {
        super(vertices);
    }

    clone(): Shape {
        const clonedVertices = new Array<Vec2>();

        this.vertices.forEach((vertex) => {
            const clone = { x: vertex.x, y: vertex.y };
            clonedVertices.push(clone);
        });

        return new SprayShape(clonedVertices, this.radius);
    }
}
