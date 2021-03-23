import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MaterialModule } from '@app/material.module';
import { ServerService } from '@app/server-communication/service/server.service';
import { HotkeyModule } from 'angular2-hotkeys';
import { of, throwError } from 'rxjs';
import { ImageNavigationComponent } from './image-navigation.component';

// tslint:disable: no-any
describe('ImageNavigationComponent', () => {
    let component: ImageNavigationComponent;
    let fixture: ComponentFixture<ImageNavigationComponent>;

    let matDialogRefSpy: jasmine.SpyObj<any>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    let matSnackBarStub: jasmine.SpyObj<MatSnackBar>;

    let serverServiceSpy: jasmine.SpyObj<ServerService>;
    let displayMessageSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<ImageNavigationComponent>', ['afterClosed', 'close']);
        matDialogRefSpy.afterClosed.and.returnValue(of());

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'openDialogs']);
        matDialogSpy.open.and.callFake(() => {
            return matDialogRefSpy;
        });

        matSnackBarStub = jasmine.createSpyObj('MatSnackBar', ['open']);
        matSnackBarStub.open.and.callThrough();

        serverServiceSpy = jasmine.createSpyObj('ServerService', ['getDrawingsByLabelsOneMatch', 'getAllLabels', 'getAllDrawings', 'deleteDrawing']);
        serverServiceSpy.getDrawingsByLabelsOneMatch.and.returnValue(of([]));
        serverServiceSpy.getAllLabels.and.returnValue(of([]));
        serverServiceSpy.getAllDrawings.and.returnValue(of([]));
        serverServiceSpy.deleteDrawing.and.returnValue(of());

        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule, HotkeyModule.forRoot()],
            declarations: [ImageNavigationComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: HttpClient },
                { provide: HttpHandler },
                { provide: ServerService, useValue: serverServiceSpy },
                { provide: MatSnackBar, useValue: matSnackBarStub },
                { provide: KeyboardService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        displayMessageSpy = spyOn(component, 'displayMessage').and.stub();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('removeFilter should call filterDrawings on all labels if retainedLabels is emptied', () => {
        const FILTER_SPY: jasmine.Spy<any> = spyOn<any>(component, 'filterDrawings').and.callThrough();
        component.retainedLabels.push('test');
        component.removeFilter(component.retainedLabels.indexOf('test'));
        expect(component.retainedLabels.length).toBe(0);
        expect(FILTER_SPY).toHaveBeenCalled();
    });
    it('removeFilter should call filterDrawings if retainedElements is not emptied', () => {
        const FILTER_SPY: jasmine.Spy<any> = spyOn<any>(component, 'filterDrawings').and.callThrough();
        component.retainedLabels.push('test1');
        component.retainedLabels.push('test2');
        component.removeFilter(component.retainedLabels.indexOf('test1'));
        expect(FILTER_SPY).toHaveBeenCalled();
    });
    it('removeFilter should call filterDrawings if retainedElements is not emptied', () => {
        const FILTER_SPY: jasmine.Spy<any> = spyOn<any>(component, 'filterDrawings').and.callThrough();
        component.addFilter('test');
        expect(FILTER_SPY).toHaveBeenCalled();
    });
    it('filtering drawings should call server service getDrawingsByLabelsOneMatch method if given labels', () => {
        component.filterDrawings(['One']);
        expect(serverServiceSpy.getDrawingsByLabelsOneMatch).toHaveBeenCalled();
    });

    it('filtering drawings should call server service getAllDrawings method if given no labels', () => {
        component.filterDrawings([]);
        expect(serverServiceSpy.getAllDrawings).toHaveBeenCalled();
    });

    it('handleDeleteImageEvent() should request that the server delete the given image', () => {
        component.handleDeleteImageEvent('123');
        expect(serverServiceSpy.deleteDrawing).toHaveBeenCalled();
    });

    it('handleDeleteImageEvent() should display a success message in the snack bar if request succeeds', () => {
        serverServiceSpy.deleteDrawing.and.returnValue(of(({} as unknown) as void));
        component.handleDeleteImageEvent('123');
        expect(displayMessageSpy).toHaveBeenCalled();
    });

    it('handleDeleteImageEvent() should display an error in the snack bar if the request fails', () => {
        const error: HttpErrorResponse = new HttpErrorResponse({
            error: '',
            status: 404,
            statusText: '',
        });

        serverServiceSpy.deleteDrawing.and.returnValue(throwError(error));
        component.handleDeleteImageEvent('123');
        expect(displayMessageSpy).toHaveBeenCalled();
    });
});
