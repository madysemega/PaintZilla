import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';
import { IUserAction } from './user-action';

export class UserActionRenderSelection implements IUserAction {
    apply(): void {
        this.selectionHandler.restoreFromMemento(this.handlerMemento);
        this.selectionHandler.drawSelection(this.drawingService.baseCtx, this.topLeft);
    }

    constructor(
        private drawingService: DrawingService,
        private selectionHandler: SelectionHandlerService,
        private handlerMemento: HandlerMemento,
        private topLeft: Vec2,
    ) {}
}
