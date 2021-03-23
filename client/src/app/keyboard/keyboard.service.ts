import { Injectable } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardAction } from './keyboard-action';

@Injectable({
    providedIn: 'root',
})
export class KeyboardService {
    static readonly DEFAULT_CONTEXT: string = 'default';

    context: string;

    private savedContextStack: string[];

    constructor(private hotkeysService: HotkeysService) {
        this.context = KeyboardService.DEFAULT_CONTEXT;
        this.savedContextStack = new Array<string>();
    }

    registerAction(action: KeyboardAction): void {
        this.hotkeysService.add(
            new Hotkey(action.trigger, (event: KeyboardEvent): boolean => {
                event.preventDefault();
                event.stopPropagation();
                if (action.contexts.includes(this.context) || action.contexts.includes('always')) {
                    action.invoke();
                }
                return false;
            }),
        );
    }

    saveContext(): void {
        this.savedContextStack.push(this.context);
    }

    restoreContext(): void {
        const lastContext = this.savedContextStack.pop();
        this.context = lastContext === undefined ? KeyboardService.DEFAULT_CONTEXT : lastContext;
    }
}
