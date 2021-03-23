import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from './shape';
import { VerticesShape } from './vertices-shape';

export class EraserShape extends VerticesShape {
    constructor(public vertices: Vec2[], public strokeWidth: number) {
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

        return new EraserShape(clonedVertices, this.strokeWidth);
    }
}
