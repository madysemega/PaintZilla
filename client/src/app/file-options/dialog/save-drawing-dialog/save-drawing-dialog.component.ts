import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACK_BAR_DURATION } from '@app/common-constants';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SEPARATOR_KEY_CODES } from '@app/file-options/dialog/save-drawing-dialog/save-drawing-dialog.constant';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { ServerService } from '@app/server-communication/service/server.service';
import * as RegularExpressions from '@common/validation/regular.expressions';

@Component({
    selector: 'app-save-drawing-dialog',
    templateUrl: './save-drawing-dialog.component.html',
    styleUrls: ['./save-drawing-dialog.component.scss'],
})
export class SaveDrawingDialogComponent implements OnInit {
    @ViewChild('labelInput') input: ElementRef<HTMLInputElement>;
    SEPARATORS: number[] = SEPARATOR_KEY_CODES;
    currentlySaving: boolean = false;
    imageName: string;
    formGroup: FormGroup;
    labels: string[] = [];

    constructor(
        public matDialogRef: MatDialogRef<SaveDrawingDialogComponent>,
        private serverService: ServerService,
        private drawingService: DrawingService,
        private snackBar: MatSnackBar,
        private keyboardService: KeyboardService,
    ) {
        this.handleKeyboardContext();
    }

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            nameForm: new FormControl('', [Validators.required, Validators.pattern(RegularExpressions.NAME_REGEX)]),
            labelForm: new FormControl('', [Validators.pattern(RegularExpressions.LABEL_REGEX)]),
        });
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const labelName = event.value;
        if (this.formGroup.controls.labelForm.valid && labelName !== '') {
            const LABEL_NOT_PRESENT = -1;
            if (this.labels.indexOf(labelName) === LABEL_NOT_PRESENT) this.labels.push(labelName);

            input.value = '';
        }
    }

    addLabelOnBlur(event: FocusEvent): void {
        const matChipEvent: MatChipInputEvent = { input: this.input.nativeElement, value: this.input.nativeElement.value };
        this.addLabel(matChipEvent);
    }

    removeLabel(label: string): void {
        const index = this.labels.indexOf(label);

        if (index >= 0) {
            this.labels.splice(index, 1);
        }
    }

    setName(event: KeyboardEvent): void {
        if (this.formGroup.controls.nameForm.valid) this.imageName = (event.target as HTMLInputElement).value;
        event.stopPropagation();
    }

    saveImage(): void {
        if (this.imageName) {
            const image: string = this.drawingService.currentDrawing;
            this.currentlySaving = true;
            this.serverService.createDrawing(this.imageName, image, this.labels).subscribe(
                () => {
                    this.openSnackBar('Le dessin a bien été sauvegardé');
                },
                (error: HttpErrorResponse) => {
                    this.openSnackBar("Le dessin n'a pas bien été sauvegardé. Erreur: " + error.message);
                },
            );
        }
    }

    openSnackBar(message: string): void {
        this.snackBar.open(message, 'Ok', {
            duration: SNACK_BAR_DURATION,
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
        });
        this.currentlySaving = false;
        this.matDialogRef.close();
    }

    private handleKeyboardContext(): void {
        this.keyboardService.saveContext();
        this.keyboardService.context = 'modal-save';
        this.matDialogRef.afterClosed().subscribe(() => this.keyboardService.restoreContext());
    }
}
