import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { ServerService } from '@app/commons/service/server.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { Drawing } from '@common/models/drawing';
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
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
        public matDialogRef: MatDialogRef<SaveDrawingDialogComponent>,
        private serverService: ServerService,
        private drawingService: DrawingService,
    ) {}
    ngOnInit(): void {
        this.formGroup = new FormGroup({
            nameForm: new FormControl('', [Validators.required, Validators.pattern(RegularExpressions.NAME_REGEX)]),
            labelForm: new FormControl('', [Validators.pattern(RegularExpressions.LABEL_REGEX)]),
        });
    }

    addLabel(event: MatChipInputEvent): void {
        const input = event.input;
        const label = event.value;

        if (this.formGroup.controls.labelForm.valid && label != '') {
            let labelNotPresent: boolean = true;
            this.labels.forEach((label: string) => {
                if (label === event.value) {
                    labelNotPresent = false;
                }
            });
            if (labelNotPresent) this.labels.push(label);

            if (input) {
                input.value = '';
            }
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
                (drawing: Drawing) => {
                    console.log(drawing.id);
                },
                (error: HttpErrorResponse) => {
                    console.log('Erreur: ' + error.message);
                },
            );
            this.currentlySaving = false;
            this.matDialogRef.close();
        }
    }
}
