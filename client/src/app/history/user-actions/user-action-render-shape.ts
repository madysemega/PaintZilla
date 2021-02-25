import { ShapeRenderer } from '@app/shapes/renderers/shape-renderer';
import { Shape } from '@app/shapes/shape';
import { IUserAction } from './user-action';

export class UserActionRenderShape implements IUserAction {
    apply(): void {
        this.renderers.forEach((renderer) => renderer.render(this.ctx));
    }

    constructor(private renderers: ShapeRenderer<Shape>[], private ctx: CanvasRenderingContext2D) {}
}
