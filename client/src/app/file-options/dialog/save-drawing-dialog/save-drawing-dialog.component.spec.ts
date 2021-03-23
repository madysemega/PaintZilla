import { HttpErrorResponse } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ServerService } from '@app/server-communication/service/server.service';
import * as RegularExpressions from '@common/validation/regular.expressions';
import { throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { SaveDrawingDialogComponent } from './save-drawing-dialog.component';

describe('SaveDrawingDialogComponent', () => {
    let component: SaveDrawingDialogComponent;
    let fixture: ComponentFixture<SaveDrawingDialogComponent>;

    // tslint:disable:no-any
    let drawingServiceSpy: jasmine.SpyObj<any>;
    let serverServiceSpy: jasmine.SpyObj<any>;

    // tslint:disable:no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;
    let htmlInput: jasmine.SpyObj<any>;
    let snackBarSpy: jasmine.SpyObj<any>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['currentDrawing']);
        serverServiceSpy = jasmine.createSpyObj('ServerService', ['createDrawing']);
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<SaveDrawingDialogComponent>', ['close']);
        htmlInput = jasmine.createSpyObj('HTMLInputElement', ['value']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            declarations: [SaveDrawingDialogComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: MatSnackBar, useValue: snackBarSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ServerService, useValue: serverServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingDialogComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        component.formGroup.controls.labelForm = new FormControl('', [Validators.required, Validators.pattern(RegularExpressions.NAME_REGEX)]);
        component.formGroup.controls.nameForm = new FormControl('', [Validators.pattern(RegularExpressions.LABEL_REGEX)]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('addLabel should add a label if it is between 1 and 15 characters and only contains alphanumeric characters', () => {
        const event: MatChipInputEvent = {
            input: htmlInput,
            value: 'tree',
        };
        component.addLabel(event);
        // tslint:disable-next-line: no-magic-numbers
        const labelIsInsideList: boolean = component.labels.indexOf(event.value) !== -1;
        expect(labelIsInsideList).toBe(true);
    });

    it('addLabel should not add a label if it is empty', () => {
        const event: MatChipInputEvent = {
            input: htmlInput,
            value: '',
        };
        component.formGroup.controls.labelForm.setValue(event.value);
        component.addLabel(event);
        // tslint:disable-next-line: no-magic-numbers
        const labelIsInsideList: boolean = component.labels.indexOf(event.value) !== -1;
        expect(labelIsInsideList).toBe(false);
    });

    it('addLabel should not add a label if it has more than 15 characters', () => {
        const event: MatChipInputEvent = {
            input: htmlInput,
            value: 'treeeeeeeeeeeeeeeeeeeeeee',
        };
        component.formGroup.controls.labelForm.setValue(event.value);
        component.addLabel(event);
        // tslint:disable-next-line: no-magic-numbers
        const labelIsInsideList: boolean = component.labels.indexOf(event.value) !== -1;
        expect(labelIsInsideList).toBe(false);
    });

    it('addLabel should not add a label that is already present in the list', () => {
        component.labels.push('tree');
        const event: MatChipInputEvent = {
            input: htmlInput,
            value: 'tree',
        };
        component.formGroup.controls.labelForm.setValue(event.value);
        component.addLabel(event);
        let labelCount = 0;
        component.labels.forEach((label: string) => {
            if (label === event.value) {
                labelCount++;
            }
        });
        expect(labelCount).toEqual(1);
    });

    it('removeLabel should remove a label that is in the list', () => {
        component.labels.push('tree');
        component.removeLabel('tree');
        // tslint:disable-next-line: no-magic-numbers
        const labelIsInsideList: boolean = component.labels.indexOf('tree') !== -1;
        expect(labelIsInsideList).toEqual(false);
    });

    it('removeLabel should remove a label that is in the list', () => {
        const spliceSpy = spyOn(component.labels, 'splice').and.callThrough();
        component.removeLabel('tree');
        expect(spliceSpy).not.toHaveBeenCalled();
    });

    it('setName should set the name if it has alphanumeric characters and spaces', () => {
        const event = ({
            target: { value: 'tree 123' },
            stopPropagation(): void {
                return;
            },
        } as unknown) as KeyboardEvent;
        component.formGroup.controls.nameForm.setValue('tree 123');
        component.setName(event);
        expect(component.imageName).toEqual('tree 123');
    });

    it('setName should not set the name if it has special characters', () => {
        const event = ({
            target: { value: 'tr$$ 123' },
            stopPropagation(): void {
                return;
            },
        } as unknown) as KeyboardEvent;
        component.formGroup.controls.nameForm.setValue('tr$$ 123');
        component.setName(event);
        expect(component.imageName).not.toEqual('tr$$ 123');
    });

    it('saveImage should call serverService.createDrawing if the drawing has a name', () => {
        component.imageName = 'tree';
        serverServiceSpy.createDrawing.and.callFake(() => {
            return of({ id: '123', name: 'tree', drawing: 'AAA', labels: ['tree'] });
        });
        component.saveImage();
        expect(serverServiceSpy.createDrawing).toHaveBeenCalled();
    });

    it('saveImage should not call serverService.createDrawing if the drawing has no name', () => {
        component.imageName = '';
        serverServiceSpy.createDrawing.and.callFake(() => {
            return of({ id: '123', name: 'tree', drawing: 'AAA', labels: ['tree'] });
        });
        component.saveImage();
        expect(serverServiceSpy.createDrawing).not.toHaveBeenCalled();
    });

    it('saveImage should open a snackbar if the drawing was successfully saved', () => {
        const message = 'Le dessin a bien été sauvegardé';
        component.imageName = 'tree';
        serverServiceSpy.createDrawing.and.callFake(() => {
            return of({ id: '123', name: 'tree', drawing: 'AAA', labels: ['tree'] });
        });
        const openSnackBarSpy = spyOn(component, 'openSnackBar').and.callThrough();
        component.saveImage();
        expect(openSnackBarSpy).toHaveBeenCalledWith(message);
    });

    it('saveImage should open a snackbar with error message if the drawing was not successfully saved', () => {
        const errorMessage = "Le dessin n'a pas bien été sauvegardé. Erreur: ";
        const error: HttpErrorResponse = new HttpErrorResponse({
            error: '',
            status: 404,
            statusText: '',
        });
        component.imageName = 'tree';
        serverServiceSpy.createDrawing.and.returnValue(throwError(error));
        const openSnackBarSpy = spyOn(component, 'openSnackBar').and.stub();
        component.saveImage();
        expect(openSnackBarSpy).toHaveBeenCalledWith('' + errorMessage + error.message);
    });
});
