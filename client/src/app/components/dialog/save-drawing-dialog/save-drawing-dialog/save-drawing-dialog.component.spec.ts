import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { SaveDrawingDialogComponent } from './save-drawing-dialog.component';

fdescribe('SaveDrawingDialogComponent', () => {
    let component: SaveDrawingDialogComponent;
    let fixture: ComponentFixture<SaveDrawingDialogComponent>;

    let historyServiceStub: HistoryService;
    let drawingServiceSpy: DrawingService;

    // tslint:disable:no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingServiceSpy = new DrawingService(historyServiceStub);
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<ExportDrawingDialogComponent>', ['close']);
        TestBed.configureTestingModule({
            declarations: [SaveDrawingDialogComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
