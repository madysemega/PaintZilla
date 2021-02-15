import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DiscardChangesDialogComponent } from './discard-changes-dialog.component';

describe('DiscardChangesDialogComponent', () => {
    let component: DiscardChangesDialogComponent;
    let fixture: ComponentFixture<DiscardChangesDialogComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DiscardChangesDialogComponent],
            providers: [{ provide: MatDialogRef, useValue: {} }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiscardChangesDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
