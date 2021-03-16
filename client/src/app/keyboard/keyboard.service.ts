import { Injectable } from '@angular/core';
import hotkeys from 'hotkeys-js';
import { KeyboardAction } from './keyboard-action';

@Injectable({
    providedIn: 'root',
})
export class KeyboardService {
    context: string;

    constructor() {
        this.context = 'default';
    }

    registerAction(action: KeyboardAction): void {
        hotkeys(action.trigger, () => {
            if (action.context === this.context || action.context === 'always') {
                action.invoke();
            }
        });
    }
}
