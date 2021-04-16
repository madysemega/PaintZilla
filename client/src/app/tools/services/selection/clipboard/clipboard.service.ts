import { Injectable } from '@angular/core';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { ManipulatorMemento } from '@app/app/classes/manipulator-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { UserActionRenderSelection } from '@app/history/user-actions/user-action-render-selection';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { SelectionHandlerService } from '@app/tools/services/selection/selection-base/selection-handler.service';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';
import { SelectionManipulatorService } from '@app/tools/services/selection/selection-base/selection-manipulator.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    private manipulatorMemento: ManipulatorMemento;
    private handlerMemento: HandlerMemento;

    copyOwner: SelectionCreatorService;
    manipulatorToRestore: SelectionManipulatorService;
    handlerToRestore: SelectionHandlerService;

    applyWhiteFill: boolean = false;
    isEmpty: boolean = true;

    constructor(private drawingService: DrawingService, private selectionHelper: SelectionHelperService, private history: HistoryService) {}

    copy(manipulatorMemento: ManipulatorMemento, handlerMemento: HandlerMemento, selectionCreator: SelectionCreatorService): void {
        this.manipulatorMemento = manipulatorMemento;
        this.handlerMemento = handlerMemento;
        this.copyOwner = selectionCreator;
        this.manipulatorToRestore = selectionCreator.selectionManipulator;
        this.handlerToRestore = selectionCreator.selectionManipulator.selectionHandler;
        this.isEmpty = false;
    }

    cut(manipulatorMemento: ManipulatorMemento, handlerMemento: HandlerMemento, selectionCreator: SelectionCreatorService): void {
        this.manipulatorMemento = manipulatorMemento;
        this.handlerMemento = handlerMemento;
        this.copyOwner = selectionCreator;
        this.manipulatorToRestore = selectionCreator.selectionManipulator;
        this.handlerToRestore = selectionCreator.selectionManipulator.selectionHandler;
        if (this.applyWhiteFill) {
            this.handlerToRestore.whiteFillAtOriginalLocation();
            this.registerWhiteFillInHistory();
        }
        this.isEmpty = false;
    }

    paste(): void {
        if (!this.isEmpty) {
            this.manipulatorToRestore.restoreFromMemento(this.manipulatorMemento);
            this.positionAtOrigin();
            this.handlerToRestore.restoreFromMemento(this.handlerMemento);
            this.copyOwner.selectionHelper.setIsSelectionBeingManipulated(true);
            this.handlerToRestore.needWhitePostDrawing = false;
            this.handlerToRestore.drawSelection(this.drawingService.previewCtx, this.manipulatorToRestore.topLeft);
            this.copyOwner.selectionManipulator.drawSelectionOutline();
            this.applyWhiteFill = false;
        }
    }

    positionAtOrigin(): void {
        const isReversedX: boolean = this.manipulatorToRestore.isReversedX;
        const isReversedY: boolean = this.manipulatorToRestore.isReversedY;
        let temp: Vec2;

        if (isReversedX) {
            temp = { x: -this.manipulatorToRestore.bottomRight.x, y: 0 };
            this.manipulatorToRestore.bottomRight = { x: 0, y: this.manipulatorToRestore.bottomRight.y };
            this.selectionHelper.addInPlace(this.manipulatorToRestore.topLeft, temp);
        } else {
            temp = { x: -this.manipulatorToRestore.topLeft.x, y: 0 };
            this.manipulatorToRestore.topLeft = { x: 0, y: this.manipulatorToRestore.topLeft.y };
            this.selectionHelper.addInPlace(this.manipulatorToRestore.bottomRight, temp);
        }

        if (isReversedY) {
            temp = { x: 0, y: -this.manipulatorToRestore.bottomRight.y };
            this.manipulatorToRestore.bottomRight = { x: this.manipulatorToRestore.bottomRight.x, y: 0 };
            this.selectionHelper.addInPlace(this.manipulatorToRestore.topLeft, temp);
        } else {
            temp = { x: 0, y: -this.manipulatorToRestore.topLeft.y };
            this.manipulatorToRestore.topLeft = { x: this.manipulatorToRestore.topLeft.x, y: 0 };
            this.selectionHelper.addInPlace(this.manipulatorToRestore.bottomRight, temp);
        }
    }

    registerWhiteFillInHistory(): void {
        const userAction: UserActionRenderSelection = new UserActionRenderSelection(
            this.drawingService,
            this.handlerToRestore,
            this.handlerMemento,
            {
                x: 0,
                y: 0,
            },
            true,
        );
        this.history.register(userAction);
    }
}
