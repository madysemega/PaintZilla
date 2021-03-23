import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from './shape';

export class VerticesShape extends Shape {
    constructor(public vertices: Vec2[]) {
        super();
    }

    clear(): void {
        this.vertices = [];
    }

    clone(): Shape {
        const clonedVertices = new Array<Vec2>();

        this.vertices.forEach((vertex) => {
            const clone = { x: vertex.x, y: vertex.y };
            clonedVertices.push(clone);
        });

        return new VerticesShape(clonedVertices);
    }
}
