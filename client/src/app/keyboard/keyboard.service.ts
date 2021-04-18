import { Injectable } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardAction } from './keyboard-action';
import { DEFAULT_CONTEXT } from './keyboard.constants'

@Injectable({
    providedIn: 'root',
})
export class KeyboardService {

    context: string = DEFAULT_CONTEXT;
    private savedContextStack: string[] = new Array<string>();
    private registeredShortcutNames: string[] = new Array<string>();

    constructor(private hotkeysService: HotkeysService) { }

    registerAction(action: KeyboardAction): void {
        const actionHasAlreadyBeenRegistered = this.registeredShortcutNames.find((name) => name === action.uniqueName) !== undefined;

        if (!actionHasAlreadyBeenRegistered) {
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

            this.registeredShortcutNames.push(action.uniqueName);
        }
    }

    saveContext(): void {
        this.savedContextStack.push(this.context);
    }

    restoreContext(): void {
        const lastContext = this.savedContextStack.pop();
        this.context = lastContext === undefined ? DEFAULT_CONTEXT : lastContext;
    }
}
