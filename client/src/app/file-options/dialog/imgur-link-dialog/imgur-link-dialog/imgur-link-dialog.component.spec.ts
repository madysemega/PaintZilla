import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImgurLinkDialogComponent } from './imgur-link-dialog.component';

describe('ImgurLinkDialogComponent', () => {
    let component: ImgurLinkDialogComponent;
    let fixture: ComponentFixture<ImgurLinkDialogComponent>;
    // tslint:disable-next-line: no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;
    beforeEach(async(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<ExportDrawingDialogComponent>', ['close']);
        TestBed.configureTestingModule({
            declarations: [ImgurLinkDialogComponent],
            imports: [MatDialogModule, MatIconModule, MatTooltipModule],
            providers: [{ provide: MatDialogRef, useValue: matDialogRefSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImgurLinkDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('copyLink() should call navigator.clipboard.writeText() and close the dialog', () => {
        const navigatorSpy = spyOn(navigator.clipboard, 'writeText').and.stub();
        component.copyLink();
        expect(navigatorSpy).toHaveBeenCalled();
        expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
});
