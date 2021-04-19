import { Vec2 } from '@app/app/classes/vec2';
import { Shape } from '@app/shapes/shape';
import * as Constants from '@app/shapes/types/line-shape/line-shape-constants';

export class LineShape extends Shape {
    static readonly DEFAULT_JOINTS_DIAMETER: number = 5;

    constructor(public vertices: Vec2[], public jointsDiameter: number = LineShape.DEFAULT_JOINTS_DIAMETER) {
        super();
    }

    getFinalMousePosition(realMousePosition: Vec2, isShiftDown: boolean): Vec2 {
        const isLineBeingDrawn = this.vertices.length > 0;
        if (!isShiftDown || !isLineBeingDrawn) return realMousePosition;

        const lastVertex = this.vertices[this.vertices.length - 1];

        const delta: Vec2 = {
            x: realMousePosition.x - lastVertex.x,
            y: realMousePosition.y - lastVertex.y,
        };

        const adjustedTheta: number = this.getMouseAttributes(delta);

        return this.getVectorAttributes(delta, adjustedTheta, lastVertex);
    }
    getVectorAttributes(delta: Vec2, adjustedTheta: number, lastVertex: Vec2): Vec2 {
        let vecLength: number = Math.sqrt(delta.x ** 2 + delta.y ** 2);

        const isSegmentHorizontal = adjustedTheta % Math.PI === 0;
        const isSegmentVertical = (adjustedTheta + Math.PI / 2) % Math.PI === 0;

        if (isSegmentHorizontal) {
            vecLength = Math.abs(delta.x);
        } else if (isSegmentVertical) {
            vecLength = Math.abs(delta.y);
        }

        return {
            x: lastVertex.x + Math.cos(adjustedTheta) * vecLength,
            y: lastVertex.y + Math.sin(adjustedTheta) * vecLength,
        };
    }
    getMouseAttributes(delta: Vec2): number {
        const realTheta: number = Math.atan2(delta.y, delta.x);

        const offset: number = Math.PI / Constants.HALF_ANGLE_OFFSET_FACTOR_INV;
        const circleQuarter: number = Math.PI / Constants.QUARTER_CIRCLE_FACTOR_INV;
        const ajustedTheta: number = Math.floor((realTheta + offset) / circleQuarter) * circleQuarter;
        return ajustedTheta;
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

    clone(): Shape {
        const clonedVertices = new Array<Vec2>();

        this.vertices.forEach((vertex) => {
            if (vertex != undefined) {
                const clone = { x: vertex.x, y: vertex.y };
                clonedVertices.push(clone);
            }
        });

        return new LineShape(clonedVertices, this.jointsDiameter);
    }
}
