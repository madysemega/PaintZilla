import { Vec2 } from '@app/app/classes/vec2';
import { VerticesShape } from './vertices-shape';

describe('VerticesShape', () => {
    let shape: VerticesShape;
    let vertices: Vec2[];

    beforeEach(() => {
        vertices = new Array<Vec2>();
        shape = new VerticesShape(vertices);
    });

    it('clone should return a shape with the same vertex positions as the original', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });

        const clonedShape = shape.clone() as VerticesShape;

        clonedShape.vertices.forEach((vertex, index) => {
            expect(vertex.x).toEqual(vertices[index].x);
            expect(vertex.y).toEqual(vertices[index].y);
        });
    });
});
