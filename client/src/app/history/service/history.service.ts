import { Injectable } from '@angular/core';
import { IUserAction } from '@app/history/user-actions/user-action';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    constructor() {
        this.past = new Array<IUserAction>();
        this.future = new Array<IUserAction>();
        this.undoEventObservers = new Array<() => void>();
    }

    private undoEventObservers: (() => void)[];

    private past: IUserAction[];
    private future: IUserAction[];

    onUndo(callback: () => void): void {
        this.undoEventObservers.push(callback);
    }

    do(action: IUserAction): void {
        this.register(action);
        action.apply();
    }

    register(action: IUserAction): void {
        this.future = new Array<IUserAction>();
        this.past.push(action);
    }

    undo(): void {
        const lastAction = this.past.pop();

        if (lastAction != undefined) {
            this.future.push(lastAction);

            this.undoEventObservers.forEach((observerCallback) => observerCallback());

            this.past.forEach((action) => action.apply());
        }
    }

    redo(): void {
        const lastUndoneAction = this.future.pop();

        if (lastUndoneAction != undefined) {
            this.past.push(lastUndoneAction);

            lastUndoneAction.apply();
        }
    }
}
