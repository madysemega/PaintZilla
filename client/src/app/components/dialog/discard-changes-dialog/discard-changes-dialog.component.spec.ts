import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { DiscardChangesDialogComponent } from './discard-changes-dialog.component';

describe('DiscardChangesDialogComponent', () => {
    let component: DiscardChangesDialogComponent;
    let fixture: ComponentFixture<DiscardChangesDialogComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule],
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
