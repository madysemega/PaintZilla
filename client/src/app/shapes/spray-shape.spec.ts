import { Vec2 } from '@app/app/classes/vec2';
import { SprayShape } from './spray-shape';

describe('SprayShape', () => {
    const INITIAL_RADIUS = 3;

    let shape: SprayShape;
    let vertices: Vec2[];

    beforeEach(() => {
        vertices = new Array<Vec2>();
        shape = new SprayShape(vertices, INITIAL_RADIUS);
    });

    it('clone should return a shape with the same vertex positions', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });

        const clonedShape = shape.clone() as SprayShape;

        clonedShape.vertices.forEach((vertex, index) => {
            expect(vertex.x).toEqual(vertices[index].x);
            expect(vertex.y).toEqual(vertices[index].y);
        });
    });
});
