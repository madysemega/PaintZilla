import { Injectable } from '@angular/core';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    constructor(private keyboardService: KeyboardService) {
        this.registerKeyboardShortcuts();
    }

    isActivated: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private registerKeyboardShortcuts(): void {
        this.keyboardService.registerAction({
            trigger: 'm',
            invoke: () => this.toggleMagnetism(),
            uniqueName: 'Toggle magnetism',
            contexts: ['editor'],
        });
    }

    toggleMagnetism(): void {
        this.isActivated.next(!this.isActivated.value);
    }
}
