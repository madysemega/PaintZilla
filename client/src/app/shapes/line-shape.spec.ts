import { Vec2 } from "@app/app/classes/vec2";
import { LineShape } from "./line-shape";
import { ShapeProperty } from "./properties/shape-property";

describe('LineShape', () => {
    let lineShape: LineShape;
    let properties: ShapeProperty[];
    let vertices: Vec2[];

    beforeEach(() => {
        properties = new Array<ShapeProperty>();
        vertices = new Array<Vec2>();
        lineShape = new LineShape(properties, vertices);
    });

    it('should should be closeable if it has enough vertices and we are trying to close it at <= 20px from first vertex', () => {
        vertices.push({x: 0, y: 0});
        vertices.push({x: 0, y: 20});
        vertices.push({x: 20, y: 20});
        const testPoint: Vec2 = {x: 3, y: 3};
        expect(lineShape.isCloseableWith(testPoint)).toBeTruthy();
    });

    it('should not be closeable if we try to close it further than 20px from first vertex', () => {
        vertices.push({x: 0, y: 0});
        vertices.push({x: 0, y: 20});

        const testPoint: Vec2 = {x: 42, y: 42};
        expect(lineShape.isCloseableWith(testPoint)).toBeFalsy();
        
        vertices.push({x: 20, y: 20});
        expect(lineShape.isCloseableWith(testPoint)).toBeFalsy();
    });

    it('should not be closeable if it doesn\'t have enough vertices (less than three)', () => {
        const farTestPoint: Vec2 = {x: 42, y: 42};
        const closeTestPoint: Vec2 = {x: 3, y: 3};
       
        expect(lineShape.isCloseableWith(farTestPoint)).toBeFalsy();
        expect(lineShape.isCloseableWith(closeTestPoint)).toBeFalsy();
        vertices.push({x: 0, y: 0});
        expect(lineShape.isCloseableWith(farTestPoint)).toBeFalsy();
        expect(lineShape.isCloseableWith(closeTestPoint)).toBeFalsy();
        vertices.push({x: 0, y: 20});
        expect(lineShape.isCloseableWith(farTestPoint)).toBeFalsy();
        expect(lineShape.isCloseableWith(closeTestPoint)).toBeFalsy();
    });

    it('close() should add a vertex in the same position where the first vertex is placed', () => {
        const firstVertex: Vec2 = {x: 0, y: 0};
        vertices.push(firstVertex);
        vertices.push({x: 0, y: 20});
        vertices.push({x: 20, y: 20});
        lineShape.close();
        expect(vertices[vertices.length - 1]).toEqual(firstVertex);
    });

    it('clear() should remove all vertices from shape', () => {
        vertices.push({x: 0, y: 0});
        vertices.push({x: 0, y: 20});
        vertices.push({x: 20, y: 20});
        lineShape.clear();
        expect(vertices.length).toEqual(0);
    });
});