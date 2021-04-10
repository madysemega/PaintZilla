import { TestBed } from '@angular/core/testing';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { UserActionRenderSelection } from './user-action-render-selection';

describe('UserActionRenderSelection', () => {
    let action: UserActionRenderSelection;
    let drawingService: DrawingService;
    let selectionHandlerSpy: SelectionHandlerService;
    let handlerMemento: HandlerMemento;
    let topLeft: Vec2;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);
        selectionHandlerSpy = jasmine.createSpyObj('SelectionHandlerService', ['restoreFromMemento', 'drawSelection', 'whiteFillAtOriginalLocation']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
        });
        drawingService = TestBed.inject(DrawingService);

        const width = 100;
        const height = 200;
        handlerMemento = new HandlerMemento(width, height);
        topLeft = { x: 5, y: 6 };
        action = new UserActionRenderSelection(drawingService, selectionHandlerSpy, handlerMemento, topLeft, false);
    });

    it('apply should restore from memento and draw the selection', () => {
        action.apply();
        expect(selectionHandlerSpy.restoreFromMemento).toHaveBeenCalled();
        expect(selectionHandlerSpy.drawSelection).toHaveBeenCalled();
    });

    it('apply should call tell the selection handler to apply white fill if the action is just a white fill ', () => {
        action = new UserActionRenderSelection(drawingService, selectionHandlerSpy, handlerMemento, topLeft, true);
        action.apply();
        expect(selectionHandlerSpy.whiteFillAtOriginalLocation).toHaveBeenCalled();
    });
});
