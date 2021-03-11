import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { ImageNavigationComponent } from './image-navigation.component';

// tslint:disable: no-any
describe('ImageNavigationComponent', () => {
    let component: ImageNavigationComponent;
    let fixture: ComponentFixture<ImageNavigationComponent>;

    let matDialogRefSpy: jasmine.SpyObj<any>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<DiscardChangesDialogComponent>', ['afterClosed']);

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'openDialogs']);
        matDialogSpy.open.and.callFake(() => {
            return matDialogRefSpy;
        });

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ImageNavigationComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
