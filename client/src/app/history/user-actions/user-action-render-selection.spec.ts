import { TestBed } from '@angular/core/testing';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';
import { UserActionRenderSelection } from './user-action-render-selection';

describe('UserActionRenderSelection', () => {
    let action: UserActionRenderSelection;
    let drawingService: DrawingService;
    let selectionHandlerSpy: SelectionHandlerService;
    let handlerMemento: HandlerMemento;
    let topLeft: Vec2;

    beforeEach(() => {
        selectionHandlerSpy = jasmine.createSpyObj('SelectionHandlerService', ['restoreFromMemento', 'drawSelection']);
        drawingService = TestBed.inject(DrawingService);
        const width = 100;
        const height = 200;
        handlerMemento = new HandlerMemento(width, height);
        topLeft = { x: 5, y: 6 };
        action = new UserActionRenderSelection(drawingService, selectionHandlerSpy, handlerMemento, topLeft);
    });

    it('apply should restore from memento and draw the selection', () => {
        action.apply();
        expect(selectionHandlerSpy.restoreFromMemento).toHaveBeenCalled();
        expect(selectionHandlerSpy.drawSelection).toHaveBeenCalled();
    });
});
