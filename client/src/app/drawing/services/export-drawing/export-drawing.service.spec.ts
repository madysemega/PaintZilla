import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExportDrawingService } from './export-drawing.service';

describe('ExportDrawingService', () => {
    let service: ExportDrawingService;
    // tslint:disable:no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;
    let matDialogSpy: jasmine.SpyObj<any>;

    const numberOfDialogs = 0;
    beforeEach(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<DiscardChangesDialogComponent>', ['afterClosed']);

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open'], { openDialogs: { length: numberOfDialogs } });
        matDialogSpy.open.and.callFake(() => {
            return matDialogRefSpy;
        });
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        });
        service = TestBed.inject(ExportDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onKeyDown should call openExportDrawingDialog() with keys Ctrl + e', () => {
        const keyboardEvent = {
            key: 'e',
            ctrlKey: true,
            preventDefault(): void {
                return;
            },
        } as KeyboardEvent;
        const openExportDrawingDialogSpy = spyOn(service, 'openExportDrawingDialog').and.stub();
        service.onKeyDown(keyboardEvent);
        expect(openExportDrawingDialogSpy).toHaveBeenCalled();
    });

    it('onKeyDown should not call openExportDrawingDialog() with other keys', () => {
        const keyboardEvent = {
            key: 'o',
            ctrlKey: true,
            preventDefault(): void {
                return;
            },
        } as KeyboardEvent;
        const openExportDrawingDialogSpy = spyOn(service, 'openExportDrawingDialog').and.stub();
        service.onKeyDown(keyboardEvent);
        expect(openExportDrawingDialogSpy).not.toHaveBeenCalled();
    });

    it('openExportDrawingDialog() should only open one dialog', () => {
        matDialogSpy.openDialogs.length = 0;
        service.openExportDrawingDialog();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('openExportDrawingDialog() should do nothing if a dialog is already opened', () => {
        matDialogSpy.openDialogs.length = 1;
        service.openExportDrawingDialog();
        expect(matDialogSpy.open).not.toHaveBeenCalled();
    });
});
