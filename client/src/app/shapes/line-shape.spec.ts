import { Vec2 } from '@app/app/classes/vec2';
import { LineShape } from './line-shape';

describe('LineShape', () => {
    let lineShape: LineShape;
    let vertices: Vec2[];

    beforeEach(() => {
        vertices = new Array<Vec2>();
        lineShape = new LineShape(vertices);
    });

    it('should should be closeable if it has enough vertices and we are trying to close it at <= 20px from first vertex', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });
        const testPoint: Vec2 = { x: 3, y: 3 };
        expect(lineShape.isCloseableWith(testPoint)).toBeTruthy();
    });

    it('should not be closeable if we try to close it further than 20px from first vertex', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });

        const testPoint: Vec2 = { x: 42, y: 42 };
        expect(lineShape.isCloseableWith(testPoint)).toBeFalsy();

        vertices.push({ x: 20, y: 20 });
        expect(lineShape.isCloseableWith(testPoint)).toBeFalsy();
    });

    it("should not be closeable if it doesn't have enough vertices (less than three)", () => {
        const farTestPoint: Vec2 = { x: 42, y: 42 };
        const closeTestPoint: Vec2 = { x: 3, y: 3 };

        expect(lineShape.isCloseableWith(farTestPoint)).toBeFalsy();
        expect(lineShape.isCloseableWith(closeTestPoint)).toBeFalsy();
        vertices.push({ x: 0, y: 0 });
        expect(lineShape.isCloseableWith(farTestPoint)).toBeFalsy();
        expect(lineShape.isCloseableWith(closeTestPoint)).toBeFalsy();
        vertices.push({ x: 0, y: 20 });
        expect(lineShape.isCloseableWith(farTestPoint)).toBeFalsy();
        expect(lineShape.isCloseableWith(closeTestPoint)).toBeFalsy();
    });

    it('close() should add a vertex with the same coordinates as the first vertex of the shape', () => {
        const firstVertex: Vec2 = { x: 0, y: 0 };
        vertices.push(firstVertex);
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });
        lineShape.close();
        expect(vertices[vertices.length - 1]).toEqual(firstVertex);
    });

    it('clear() should remove all vertices from shape', () => {
        vertices.push({ x: 0, y: 0 });
        vertices.push({ x: 0, y: 20 });
        vertices.push({ x: 20, y: 20 });
        lineShape.clear();
        expect(lineShape.vertices.length).toEqual(0);
    });

    it('getFinalMousePosition should return real mouse position if shift is not down', () => {
        const realMousePositions: Vec2[] = [
            { x: 0, y: 0 },
            { x: -36, y: 52 },
            { x: 128, y: 128 },
        ];
        realMousePositions.forEach((mousePosition) => {
            expect(lineShape.getFinalMousePosition(mousePosition, false)).toEqual(mousePosition);
        });
    });

    it('getFinalMousePosition should return a point at the same distance from the last vertex that the given mouse position is', () => {
        const mousePositions: Vec2[] = [
            { x: 0, y: 0 },
            { x: -36, y: 52 },
            { x: 128, y: 128 },
        ];
        const verticesToAdd: Vec2[] = [
            { x: 0, y: 0 },
            { x: 128, y: 128 },
            { x: -36, y: 52 },
        ];

        for (let i = 0; i < verticesToAdd.length; ++i) {
            const latestVertex = verticesToAdd[i];
            const latestMousePosition = mousePositions[i];
            lineShape.vertices.push(latestVertex);

            const expectedMagnitude = Math.sqrt((latestMousePosition.x - latestVertex.x) ** 2 + (latestMousePosition.y - latestVertex.y) ** 2);
            const ajustedMousePosition = lineShape.getFinalMousePosition(latestMousePosition, true);
            const obtainedMagnitude = Math.sqrt((ajustedMousePosition.x - latestVertex.x) ** 2 + (ajustedMousePosition.y - latestVertex.y) ** 2);

            expect(obtainedMagnitude).toEqual(expectedMagnitude);
        }
    });

    it('getFinalMousePosition should make a segment with angle multiple of 45deg with last vertex in shape', () => {
        const FOURTH = 0.25;

        const mousePositions: Vec2[] = [
            { x: 0, y: 0 },
            { x: -36, y: 52 },
            { x: 128, y: 128 },
        ];
        const verticesToAdd: Vec2[] = [
            { x: 0, y: 0 },
            { x: 128, y: 128 },
            { x: -36, y: 52 },
        ];

        for (let i = 0; i < verticesToAdd.length; ++i) {
            const latestVertex = verticesToAdd[i];
            const latestMousePosition = mousePositions[i];
            lineShape.vertices.push(latestVertex);

            const ajustedMousePosition = lineShape.getFinalMousePosition(latestMousePosition, true);
            const ajustedAngle = Math.atan2(ajustedMousePosition.y - latestVertex.y, ajustedMousePosition.x - latestVertex.x);

            expect(Math.abs(ajustedAngle % (Math.PI * FOURTH))).toEqual(0);
        }
    });
});
