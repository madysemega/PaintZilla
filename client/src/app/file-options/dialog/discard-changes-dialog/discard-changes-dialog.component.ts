import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { KeyboardService } from '@app/keyboard/keyboard.service';

@Component({
    selector: 'app-discard-changes-dialog',
    templateUrl: './discard-changes-dialog.component.html',
    styleUrls: ['./discard-changes-dialog.component.scss'],
})
export class DiscardChangesDialogComponent {
    constructor(public matDialogRef: MatDialogRef<DiscardChangesDialogComponent>, private keyboardService: KeyboardService) {
        this.handleKeyboardContext();
    }

    private handleKeyboardContext(): void {
        this.keyboardService.saveContext();
        this.keyboardService.context = 'modal-discard';
        this.matDialogRef.afterClosed().subscribe(() => this.keyboardService.restoreContext());
    }
}
