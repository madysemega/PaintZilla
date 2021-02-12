import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from './shape';

export class LineShape extends Shape {
    getFinalMousePosition(realMousePosition: Vec2, isShiftDown: boolean): Vec2 {
        const HALF_ANGLE_OFFSET_FACTOR_INV = 8;
        const QUARTER_CIRCLE_FACTOR_INV = 4;

        const isLineBeingDrawn = this.vertices.length > 0;
        if (!isShiftDown || !isLineBeingDrawn) return realMousePosition;

        const lastVertex = this.vertices[this.vertices.length - 1];

        const delta: Vec2 = {
            x: realMousePosition.x - lastVertex.x,
            y: realMousePosition.y - lastVertex.y,
        };

        const realTheta: number = Math.atan2(delta.y, delta.x);

        const offset: number = Math.PI / HALF_ANGLE_OFFSET_FACTOR_INV;
        const circleQuarter: number = Math.PI / QUARTER_CIRCLE_FACTOR_INV;
        const ajustedTheta: number = Math.floor((realTheta + offset) / circleQuarter) * circleQuarter;

        const vecLength: number = Math.sqrt(delta.x ** 2 + delta.y ** 2);

        const ajustedVector: Vec2 = {
            x: lastVertex.x + Math.cos(ajustedTheta) * vecLength,
            y: lastVertex.y + Math.sin(ajustedTheta) * vecLength,
        };

        return ajustedVector;
    }

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

    constructor(public vertices: Vec2[]) {
        super();
    }
}
