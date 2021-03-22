import { Injectable } from '@angular/core';
import hotkeys from 'hotkeys-js';
import { KeyboardAction } from './keyboard-action';

@Injectable({
    providedIn: 'root',
})
export class KeyboardService {
    static readonly DEFAULT_CONTEXT: string = 'default';

    context: string;

    private savedContextStack: string[];

    constructor() {
        this.context = KeyboardService.DEFAULT_CONTEXT;
        this.savedContextStack = new Array<string>();
    }

    registerAction(action: KeyboardAction): void {
        hotkeys(action.trigger, (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (action.contexts.includes(this.context) || action.contexts.includes('always')) {
                action.invoke();
            }
        });
    }

    saveContext(): void {
        this.savedContextStack.push(this.context);
    }

    restoreContext(): void {
        const lastContext = this.savedContextStack.pop();
        this.context = lastContext === undefined ? KeyboardService.DEFAULT_CONTEXT : lastContext;
    }
}
