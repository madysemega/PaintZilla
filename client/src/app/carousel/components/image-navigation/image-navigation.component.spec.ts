import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { ServerService } from '@app/server-communication/service/server.service';
import { of } from 'rxjs';
import { ImageNavigationComponent } from './image-navigation.component';

// tslint:disable: no-any
describe('ImageNavigationComponent', () => {
    let component: ImageNavigationComponent;
    let fixture: ComponentFixture<ImageNavigationComponent>;

    let matDialogRefSpy: jasmine.SpyObj<any>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    let serverServiceSpy: jasmine.SpyObj<ServerService>;

    beforeEach(async(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<DiscardChangesDialogComponent>', ['afterClosed']);

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'openDialogs']);
        matDialogSpy.open.and.callFake(() => {
            return matDialogRefSpy;
        });

        serverServiceSpy = jasmine.createSpyObj('ServerService', ['getDrawingsByLabelsAllMatch', 'getAllLabels', 'getAllDrawings']);
        serverServiceSpy.getDrawingsByLabelsAllMatch.and.returnValue(of([]));
        serverServiceSpy.getAllLabels.and.returnValue(of([]));
        serverServiceSpy.getAllDrawings.and.returnValue(of([]));

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ImageNavigationComponent],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: HttpClient },
                { provide: HttpHandler },
                { provide: ServerService, useValue: serverServiceSpy },
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

    it('filtering drawings should call server service getDrawingsByLabelsAllMatch method', () => {
        component.filterDrawings([]);
        expect(serverServiceSpy.getDrawingsByLabelsAllMatch).toHaveBeenCalled();
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
});
