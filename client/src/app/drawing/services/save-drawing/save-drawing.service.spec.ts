import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SaveDrawingService } from './save-drawing.service';

describe('SaveDrawingService', () => {
    let service: SaveDrawingService;
    let matDialogRefSpy: jasmine.SpyObj<any>;
    let matDialogSpy: jasmine.SpyObj<any>;

    const numberOfDialogs = 0;
    beforeEach(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<SaveDrawingDialogComponent>', ['afterClosed']);

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open'], { openDialogs: { length: numberOfDialogs } });
        matDialogSpy.open.and.callFake(() => {
            return matDialogRefSpy;
        });
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        });
        service = TestBed.inject(SaveDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onKeyDown should call openSaveDrawingDialog() with keys Ctrl + s', () => {
        const keyboardEvent = {
            key: 's',
            ctrlKey: true,
            preventDefault(): void {
                return;
            },
        } as KeyboardEvent;
        const openSaveDrawingDialogSpy = spyOn(service, 'openSaveDrawingDialog').and.stub();
        service.onKeyDown(keyboardEvent);
        expect(openSaveDrawingDialogSpy).toHaveBeenCalled();
    });

    it('onKeyDown should not call openSaveDrawingDialog() with other keys', () => {
        const keyboardEvent = {
            key: 'o',
            ctrlKey: true,
            preventDefault(): void {
                return;
            },
        } as KeyboardEvent;
        const openSaveDrawingDialogSpy = spyOn(service, 'openSaveDrawingDialog').and.stub();
        service.onKeyDown(keyboardEvent);
        expect(openSaveDrawingDialogSpy).not.toHaveBeenCalled();
    });

    it('openSaveDrawingDialog() should only open one dialog', () => {
        matDialogSpy.openDialogs.length = 0;
        service.openSaveDrawingDialog();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('openSaveDrawingDialog() should do nothing if a dialog is already opened', () => {
        matDialogSpy.openDialogs.length = 1;
        service.openSaveDrawingDialog();
        expect(matDialogSpy.open).not.toHaveBeenCalled();
    });
});
