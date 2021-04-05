import { EventEmitter, Injectable } from '@angular/core';
import { sleep } from '@app/app/classes/sleep';
import { IUserAction } from '@app/history/user-actions/user-action';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    constructor() {
        this.past = new Array<IUserAction>();
        this.future = new Array<IUserAction>();
        this.undoEventObservers = new Array<() => void>();

        this.isLocked = false;

        this.onDrawingModification = new EventEmitter();
    }
    onDrawingModification: EventEmitter<boolean>;

    private undoEventObservers: (() => void)[];

    private past: IUserAction[];
    private future: IUserAction[];

    isLocked: boolean;

    onUndo(callback: () => void): void {
        this.undoEventObservers.push(callback);
    }

    do(action: IUserAction): void {
        this.register(action);
        action.apply();
        this.onDrawingModification.emit();
    }

    register(action: IUserAction): void {
        this.future = new Array<IUserAction>();
        this.past.push(action);

        this.isLocked = false;

        this.onDrawingModification.emit();
    }

    async undo(): Promise<void> {
        if (this.canUndo()) {
            const lastAction = this.past.pop() as IUserAction;

            this.future.push(lastAction);

            this.undoEventObservers.forEach((observerCallback) => observerCallback());

            for (const action of this.past) {
                await sleep();
                action.apply();
            }

            this.onDrawingModification.emit();
        }
    }

    redo(): void {
        if (this.canRedo()) {
            const lastUndoneAction = this.future.pop() as IUserAction;

            this.past.push(lastUndoneAction);

            lastUndoneAction.apply();

            this.onDrawingModification.emit();
        }
    }

    canUndo(): boolean {
        return this.past.length > 0 && !this.isLocked;
    }

    canRedo(): boolean {
        return this.future.length > 0 && !this.isLocked;
    }

    clear(): void {
        this.past.length = 0;
        this.future.length = 0;
        this.isLocked = false;
    }
}
