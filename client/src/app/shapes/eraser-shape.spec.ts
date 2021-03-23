import { Vec2 } from '@app/app/classes/vec2';
import { EraserShape } from './eraser-shape';
import { VerticesShape } from './vertices-shape';

describe('EraserShape', () => {
    const DEFAULT_STROKE_WIDTH = 5;

    let shape: EraserShape;

    let vertices: Vec2[];
    let strokeWidth: number;

    beforeEach(() => {
        strokeWidth = DEFAULT_STROKE_WIDTH;

        vertices = new Array<Vec2>();
        shape = new EraserShape(vertices, strokeWidth);
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
