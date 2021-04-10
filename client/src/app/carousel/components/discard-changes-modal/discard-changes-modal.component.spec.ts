import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DiscardChangesModalData } from '@app/carousel/interfaces/discard-changes-modal-data';
import { MaterialModule } from '@app/material.module';
import { DiscardChangesModalComponent } from './discard-changes-modal.component';

// tslint:disable: no-any
describe('DiscardChangesModalComponent', () => {
    let component: DiscardChangesModalComponent;
    let fixture: ComponentFixture<DiscardChangesModalComponent>;

    let matDialogRefSpy: jasmine.SpyObj<any>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let matDialogData: DiscardChangesModalData;

    let confirmCallbackSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<DiscardChangesModalComponent>', ['close']);

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogSpy.open.and.callFake(() => {
            return matDialogRefSpy;
        });

        // tslint:disable-next-line: no-empty
        matDialogData = { confirmCallback(): void {} };

        confirmCallbackSpy = spyOn(matDialogData, 'confirmCallback').and.stub();

        TestBed.configureTestingModule({
            imports: [MaterialModule, MatTooltipModule, CommonModule],
            declarations: [DiscardChangesModalComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: MAT_DIALOG_DATA, useValue: matDialogData },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiscardChangesModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('confirm() should call confirm callback', () => {
        component.confirm();
        expect(confirmCallbackSpy).toHaveBeenCalled();
    });
});
