import { ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACK_BAR_DURATION } from '@app/common-constants';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ServerService } from '@app/server-communication/service/server.service';
import * as RegularExpressions from '@common/validation/regular.expressions';
@Component({
    selector: 'app-save-drawing-dialog',
    templateUrl: './save-drawing-dialog.component.html',
    styleUrls: ['./save-drawing-dialog.component.scss'],
})
export class SaveDrawingDialogComponent implements OnInit {
    currentlySaving: boolean = false;
    imageName: string;
    formGroup: FormGroup;
    labels: string[] = [];
    readonly separatorKeysCodes: number[] = [ENTER];

    constructor(
        public matDialogRef: MatDialogRef<SaveDrawingDialogComponent>,
        private serverService: ServerService,
        private drawingService: DrawingService,
        private snackBar: MatSnackBar,
    ) {}

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
}
