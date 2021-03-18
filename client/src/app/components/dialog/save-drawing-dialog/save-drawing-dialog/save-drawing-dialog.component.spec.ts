import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerService } from '@app/commons/service/server.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { SaveDrawingDialogComponent } from './save-drawing-dialog.component';

fdescribe('SaveDrawingDialogComponent', () => {
    let component: SaveDrawingDialogComponent;
    let fixture: ComponentFixture<SaveDrawingDialogComponent>;

    let historyServiceStub: HistoryService;
    let drawingServiceSpy: DrawingService;
    let serverServiceSpy: ServerService;

    // tslint:disable:no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingServiceSpy = new DrawingService(historyServiceStub);
        serverServiceSpy = TestBed.inject(ServerService);
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<ExportDrawingDialogComponent>', ['close']);
        TestBed.configureTestingModule({
            declarations: [SaveDrawingDialogComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: MatSnackBar, useValue: {} },
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ServerService, useValue: serverServiceSpy },
                { provide: HttpClient, useValue: {} },
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
