import { Injectable } from '@angular/core';
import { MouseButton } from '@app/app/classes/mouse';
import { Vec2, VectorOperations } from '@app/app/classes/vec2';

export enum Constraint {
    None = 'none',
    Vertical = 'vertical',
    Horizontal = 'horizontal',
}

@Injectable({
    providedIn: 'root',
})
export class DrawingSurfaceResizingService {
    private firstPosition: Vec2;
    private resizing: boolean;
    private newSize: Vec2;
    private modified: boolean;
    private constraint: Constraint;
    private anchorPoint: Vec2;
    private vectorOperations: VectorOperations;
    onMouseDown(event: MouseEvent, constraint: Constraint): void {
        if (event.button === MouseButton.Left) {
            this.firstPosition = this.vectorOperations.sub({ x: event.pageX, y: event.pageY }, this.anchorPoint);
            this.resizing = true;
            this.constraint = constraint;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.resizing) {
            this.newSize = this.vectorOperations.sub({ x: event.pageX, y: event.pageY }, this.firstPosition);
            this.newSize = {
                x: this.constraint === Constraint.Vertical ? 0 : this.newSize.x,
                y: this.constraint === Constraint.Horizontal ? 0 : this.newSize.y,
            };
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.resizing && event.button === MouseButton.Left) {
            this.onMouseMove(event);
            this.resizing = false;
            this.modified = true;
        }
    }

    isModified(): boolean {
        return this.modified;
    }

    isResizing(): boolean {
        return this.resizing;
    }

    getNewSize(): Vec2 {
        return this.newSize;
    }

    popNewSize(): Vec2 {
        this.modified = false;
        return this.newSize;
    }

    initAnchorPoint(anchorPoint: Vec2): void {
        this.anchorPoint = anchorPoint;
    }
}
