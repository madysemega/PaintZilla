import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MaterialModule } from '@app/material.module';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { of } from 'rxjs';
import { DiscardChangesDialogComponent } from './discard-changes-dialog.component';

describe('DiscardChangesDialogComponent', () => {
    let component: DiscardChangesDialogComponent;
    let fixture: ComponentFixture<DiscardChangesDialogComponent>;
    // tslint:disable:no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;
    let keyboardService: jasmine.SpyObj<any>;

    beforeEach(async(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<DiscardChangesDialogComponent>', ['close', 'afterClosed']);
        matDialogRefSpy.afterClosed.and.returnValue(of({}));
        keyboardService = jasmine.createSpyObj('KeyboardService', ['saveContext', 'restoreContext']);
        TestBed.configureTestingModule({
            imports: [MaterialModule, CommonModule, MatTooltipModule, HotkeyModule.forRoot()],
            declarations: [DiscardChangesDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: HotkeysService, useValue: hotkeysServiceStub },
                { provide: KeyboardService, useValue: keyboardService },
            ],
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

    it('handleKeyboardContext should call saveContext and restoreContext', () => {
        component.handleKeyboardContext();
        expect(keyboardService.saveContext).toHaveBeenCalled();
        expect(keyboardService.restoreContext).toHaveBeenCalled();
    });
});
