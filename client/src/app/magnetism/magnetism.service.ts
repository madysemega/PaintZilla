import { Injectable } from '@angular/core';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    
    isGrid: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isActivated: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isIncrement: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isDecrement: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private keyboardService: KeyboardService) {
        this.registerKeyboardShortcuts();
    }

    private registerKeyboardShortcuts(): void {
        this.keyboardService.registerAction({
            trigger: 'm',
            invoke: () => this.toggleMagnetism(),
            uniqueName: 'Toggle magnetism',
            contexts: ['editor'],
        });
        this.keyboardService.registerAction({
            trigger: 'g',
            invoke: () => this.toggleGrid(),
            uniqueName: 'Toggle grid',
            contexts: ['editor'],
        });
        this.keyboardService.registerAction({
            trigger: '=',
            invoke: () => this.incrementGrid(),
            uniqueName: 'Toggle grid +',
            contexts: ['editor'],
        });
        this.keyboardService.registerAction({
            trigger: '-',
            invoke: () => this.decrementGrid(),
            uniqueName: 'Toggle grid -',
            contexts: ['editor'],
        });
    }

    toggleMagnetism(): void {
        this.isActivated.next(!this.isActivated.value);
    }
    toggleGrid(): void {
        this.isGrid.next(!this.isGrid.value);
    }
    incrementGrid(): void {
        this.isIncrement.next(!this.isIncrement.value);
    }
    decrementGrid(): void {
        this.isDecrement.next(!this.isDecrement.value);
    }
}
