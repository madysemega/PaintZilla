import { Vec2 } from '@app/app/classes/vec2';
import { ShapeProperty } from './properties/shape-property';
import { Shape } from './shape';

export class LineShape extends Shape {
    isCloseableWith(lastVertex: Vec2): boolean {
        const VALID_SHAPE_MIN_NB_VERTICES = 3;
        const CLOSING_SEGMENT_LENGTH_VALIDITY_THRESHOLD = 20; // (in pixels)

        const shapeHasEnoughVertices = this.vertices.length >= VALID_SHAPE_MIN_NB_VERTICES;
        if (!shapeHasEnoughVertices) {
            return false;
        }

        const firstVertex: Vec2 = this.vertices[0];

        const closingSegmentLength: number = Math.sqrt((lastVertex.x - firstVertex.x) ** 2 + (lastVertex.y - firstVertex.y) ** 2);

        return closingSegmentLength <= CLOSING_SEGMENT_LENGTH_VALIDITY_THRESHOLD;
    }

    close(): void {
        const firstVertex: Vec2 = this.vertices[0];
        this.vertices.push(firstVertex);
    }

    clear(): void {
        this.vertices = [];
    }

    constructor(properties: ShapeProperty[], public vertices: Vec2[]) {
        super(properties);
    }
}
